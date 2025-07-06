import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const doorWidths: Record<string, number> = {
  "upvc_french_180": 1.8,
  "upvc_french_240": 2.4,
  "upvc_sliding_200": 2.0,
  "alu_sliding_200": 2.0,
  "alu_bifold_200": 2.0,
  "alu_bifold_300": 3.0,
  "upvc_sliding_400": 4.0,
};

export const calculatePrice = query({
  args: {
    length: v.number(),
    depth: v.number(),
    laminatedFloor: v.boolean(),
    skimmedFinish: v.boolean(),
    ceilingLights: v.number(),
    doubleSockets: v.number(),
    doorType: v.string(),
    aluWindows: v.number(),
    upvcWindows: v.number(),
    roofWindows: v.number(),
    frontCladding: v.string(),
    sideRearCladding: v.string(),
  },
  handler: async (ctx, args) => {
    const config = await ctx.db.query("pricingConfig").collect();
    const pricing: Record<string, Record<string, number>> = {};
    
    for (const item of config) {
      if (!pricing[item.category]) {
        pricing[item.category] = {};
      }
      pricing[item.category][item.item] = item.price;
    }

    // Calculate areas
    const floorArea = Math.round((args.length * args.depth) * 10) / 10;
    const wallHeight = 2.4;
    const wallArea = Math.round((2 * (args.length * wallHeight) + 2 * (args.depth * wallHeight)) * 10) / 10;
    const roofArea = Math.round(((args.length + 0.8) * (args.depth + 0.8)) * 10) / 10;
    
    const doorWidth = doorWidths[args.doorType] || 2.0;
    const doorArea = Math.round((doorWidth * 2.05) * 10) / 10;
    
    // Calculate Garden Room Shell (now includes fixed costs)
    let foundationCost = 0;
    if (floorArea <= 9) foundationCost = pricing.foundations?.up_to_9 || 0;
    else if (floorArea <= 12) foundationCost = pricing.foundations?.up_to_12 || 0;
    else if (floorArea <= 16) foundationCost = pricing.foundations?.up_to_16 || 0;
    else if (floorArea <= 20) foundationCost = pricing.foundations?.up_to_20 || 0;
    else if (floorArea <= 25) foundationCost = pricing.foundations?.up_to_25 || 0;
    else if (floorArea <= 30) foundationCost = pricing.foundations?.up_to_30 || 0;
    else if (floorArea <= 35) foundationCost = pricing.foundations?.up_to_35 || 0;
    else foundationCost = pricing.foundations?.up_to_40 || 0;

    const steelFrameCost = ((args.length * 3) + (args.depth * 2)) * (pricing.steel_frame?.per_meter || 0) + (pricing.steel_frame?.fixed_cost || 0);
    const osbFloorCost = floorArea * (pricing.osb_floor?.per_sqm || 0);
    const osbWallsCost = wallArea * (pricing.osb_walls?.per_sqm || 0);
    const roofCost = roofArea * (pricing.roof?.per_sqm || 0);
    
    let roofFasciaCost = 0;
    if (floorArea <= 9) roofFasciaCost = pricing.roof_fascia?.up_to_9 || 0;
    else if (floorArea <= 12) roofFasciaCost = pricing.roof_fascia?.up_to_12 || 0;
    else if (floorArea <= 20) roofFasciaCost = pricing.roof_fascia?.up_to_20 || 0;
    else roofFasciaCost = pricing.roof_fascia?.up_to_30 || 0;

    // Fixed costs (now included in shell)
    const fixedCosts = 
      (pricing.fixed_costs?.site_survey || 0) +
      (pricing.fixed_costs?.design_fee || 0) +
      (pricing.fixed_costs?.gutter || 0) +
      (pricing.fixed_costs?.waste_disposal || 0);

    const gardenRoomShell = foundationCost + steelFrameCost + osbFloorCost + osbWallsCost + roofCost + roofFasciaCost + fixedCosts;

    // Calculate other costs
    const laminatedFloorCost = args.laminatedFloor ? floorArea * (pricing.interior?.laminated_floor || 0) : 0;
    const skimmedFinishCost = args.skimmedFinish ? (wallArea + floorArea) * (pricing.interior?.skimmed_finish || 0) : 0;
    
    const consumerUnitCost = pricing.electrical?.consumer_unit || 0;
    const ceilingLightsCost = args.ceilingLights * (pricing.electrical?.ceiling_light || 0);
    const doubleSocketsCost = args.doubleSockets * (pricing.electrical?.double_socket || 0);
    const electricalsCost = consumerUnitCost + ceilingLightsCost + doubleSocketsCost;

    const doorCost = (pricing.doors?.[args.doorType] || 0) + (pricing.doors?.fitting || 0);
    
    const windowsCost = 
      (args.aluWindows * (pricing.windows?.alu_window || 0)) +
      (args.upvcWindows * (pricing.windows?.upvc_window || 0)) +
      (args.roofWindows * (pricing.windows?.roof_window || 0));

    // Calculate cladding
    const frontWallArea = Math.round((args.length * wallHeight - doorArea) * 10) / 10;
    const sideRearWallArea = Math.round((wallArea - args.length * wallHeight) * 10) / 10;
    
    let frontCladdingCost = 0;
    if (args.frontCladding === "composite") {
      frontCladdingCost = frontWallArea * (pricing.cladding?.composite || 0);
    } else if (args.frontCladding === "cedar") {
      frontCladdingCost = frontWallArea * (pricing.cladding?.cedar || 0);
    }

    let sideRearCladdingCost = 0;
    if (args.sideRearCladding === "composite") {
      sideRearCladdingCost = sideRearWallArea * (pricing.cladding?.composite || 0);
    } else if (args.sideRearCladding === "cedar") {
      sideRearCladdingCost = sideRearWallArea * (pricing.cladding?.cedar || 0);
    } else if (args.sideRearCladding === "metal") {
      sideRearCladdingCost = sideRearWallArea * (pricing.cladding?.metal_per_sqm || 0) + (pricing.cladding?.metal_fixed || 0);
    }

    const claddingCost = frontCladdingCost + sideRearCladdingCost;

    const subtotal = gardenRoomShell + laminatedFloorCost + skimmedFinishCost + electricalsCost + doorCost + windowsCost + claddingCost;
    const vat = Math.round(subtotal * 0.2 * 100) / 100;
    const total = Math.round((subtotal + vat) * 100) / 100;

    return {
      areas: {
        floorArea,
        wallArea,
        roofArea,
        doorArea,
        frontWallArea,
        sideRearWallArea,
      },
      claddingCosts: {
        frontComposite: Math.round(frontWallArea * (pricing.cladding?.composite || 0) * 100) / 100,
        frontCedar: Math.round(frontWallArea * (pricing.cladding?.cedar || 0) * 100) / 100,
        sideRearComposite: Math.round(sideRearWallArea * (pricing.cladding?.composite || 0) * 100) / 100,
        sideRearCedar: Math.round(sideRearWallArea * (pricing.cladding?.cedar || 0) * 100) / 100,
        sideRearMetal: Math.round((sideRearWallArea * (pricing.cladding?.metal_per_sqm || 0) + (pricing.cladding?.metal_fixed || 0)) * 100) / 100,
      },
      breakdown: {
        gardenRoomShell: Math.round(gardenRoomShell * 100) / 100,
        laminatedFloor: Math.round(laminatedFloorCost * 100) / 100,
        skimmedFinish: Math.round(skimmedFinishCost * 100) / 100,
        electricals: Math.round(electricalsCost * 100) / 100,
        doors: Math.round(doorCost * 100) / 100,
        windows: Math.round(windowsCost * 100) / 100,
        cladding: Math.round(claddingCost * 100) / 100,
        fixedCosts: Math.round(fixedCosts * 100) / 100,
        subtotal: Math.round(subtotal * 100) / 100,
        vat,
        total,
      },
    };
  },
});

export const saveQuote = mutation({
  args: {
    customerEmail: v.optional(v.string()),
    customerName: v.optional(v.string()),
    customerPhone: v.optional(v.string()),
    configuration: v.object({
      length: v.number(),
      depth: v.number(),
      floorArea: v.number(),
      wallArea: v.number(),
      roofArea: v.number(),
      laminatedFloor: v.boolean(),
      skimmedFinish: v.boolean(),
      ceilingLights: v.number(),
      doubleSockets: v.number(),
      doorType: v.string(),
      doorArea: v.number(),
      windows: v.object({
        aluWindows: v.number(),
        upvcWindows: v.number(),
        roofWindows: v.number(),
      }),
      frontCladding: v.string(),
      sideRearCladding: v.string(),
    }),
    priceBreakdown: v.object({
      gardenRoomShell: v.number(),
      laminatedFloor: v.number(),
      skimmedFinish: v.number(),
      electricals: v.number(),
      doors: v.number(),
      windows: v.number(),
      cladding: v.number(),
      fixedCosts: v.number(),
      subtotal: v.number(),
      vat: v.number(),
      total: v.number(),
    }),
    requestSurvey: v.boolean(),
  },
  handler: async (ctx, args) => {
    const quoteId = await ctx.db.insert("quotes", {
      ...args,
      status: args.requestSurvey ? "survey_requested" : "saved",
    });
    return quoteId;
  },
});

export const getQuotes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("quotes").order("desc").collect();
  },
});
