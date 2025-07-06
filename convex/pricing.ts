import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Initialize default pricing configuration
export const initializePricing = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if pricing already exists
    const existing = await ctx.db.query("pricingConfig").first();
    if (existing) return;

    const defaultPricing = [
      // Foundations
      { category: "foundations", item: "up_to_9", price: 360, unit: "fixed", description: "Up to 9m²" },
      { category: "foundations", item: "up_to_12", price: 490, unit: "fixed", description: "Up to 12m²" },
      { category: "foundations", item: "up_to_16", price: 660, unit: "fixed", description: "Up to 16m²" },
      { category: "foundations", item: "up_to_20", price: 820, unit: "fixed", description: "Up to 20m²" },
      { category: "foundations", item: "up_to_25", price: 1030, unit: "fixed", description: "Up to 25m²" },
      { category: "foundations", item: "up_to_30", price: 1200, unit: "fixed", description: "Up to 30m²" },
      { category: "foundations", item: "up_to_35", price: 1400, unit: "fixed", description: "Up to 35m²" },
      { category: "foundations", item: "up_to_40", price: 1600, unit: "fixed", description: "Up to 40m²" },
      
      // Steel Frame
      { category: "steel_frame", item: "per_meter", price: 10.5, unit: "per_meter", description: "Per meter" },
      { category: "steel_frame", item: "fixed_cost", price: 275, unit: "fixed", description: "Fixed cost" },
      
      // OSB Floor
      { category: "osb_floor", item: "per_sqm", price: 65, unit: "per_sqm", description: "Per m²" },
      
      // OSB Walls
      { category: "osb_walls", item: "per_sqm", price: 90, unit: "per_sqm", description: "Per m²" },
      
      // Roof
      { category: "roof", item: "per_sqm", price: 110, unit: "per_sqm", description: "Per m²" },
      
      // Roof Fascia
      { category: "roof_fascia", item: "up_to_9", price: 750, unit: "fixed", description: "Up to 9m²" },
      { category: "roof_fascia", item: "up_to_12", price: 1000, unit: "fixed", description: "Up to 12m²" },
      { category: "roof_fascia", item: "up_to_20", price: 1500, unit: "fixed", description: "Up to 20m²" },
      { category: "roof_fascia", item: "up_to_30", price: 2000, unit: "fixed", description: "Up to 30m²" },
      
      // Interior Options
      { category: "interior", item: "laminated_floor", price: 55, unit: "per_sqm", description: "Laminated floor per m²" },
      { category: "interior", item: "skimmed_finish", price: 70, unit: "per_sqm", description: "Skimmed and painted finish per m²" },
      
      // Electrical
      { category: "electrical", item: "consumer_unit", price: 230, unit: "fixed", description: "Consumer unit" },
      { category: "electrical", item: "ceiling_light", price: 70, unit: "each", description: "Ceiling downlight" },
      { category: "electrical", item: "double_socket", price: 115, unit: "each", description: "Double socket" },
      
      // Doors
      { category: "doors", item: "upvc_french_180", price: 1450, unit: "fixed", description: "UPVC French 180cm" },
      { category: "doors", item: "upvc_french_240", price: 1600, unit: "fixed", description: "UPVC French + side panels (240cm)" },
      { category: "doors", item: "upvc_sliding_200", price: 1200, unit: "fixed", description: "UPVC Sliding 200cm" },
      { category: "doors", item: "alu_sliding_200", price: 1900, unit: "fixed", description: "ALU Sliding 200cm" },
      { category: "doors", item: "alu_bifold_200", price: 1800, unit: "fixed", description: "ALU Bi-fold 200cm" },
      { category: "doors", item: "alu_bifold_300", price: 2500, unit: "fixed", description: "ALU Bi-fold 300cm" },
      { category: "doors", item: "upvc_sliding_400", price: 2150, unit: "fixed", description: "UPVC Sliding 400cm with panels" },
      { category: "doors", item: "fitting", price: 460, unit: "fixed", description: "Door fitting" },
      
      // Windows
      { category: "windows", item: "alu_window", price: 500, unit: "each", description: "ALU window (100×80cm)" },
      { category: "windows", item: "upvc_window", price: 280, unit: "each", description: "UPVC window (100×80cm)" },
      { category: "windows", item: "roof_window", price: 1500, unit: "each", description: "Roof window (120×120cm)" },
      
      // Cladding
      { category: "cladding", item: "composite", price: 125, unit: "per_sqm", description: "Composite cladding per m²" },
      { category: "cladding", item: "cedar", price: 145, unit: "per_sqm", description: "Cedar cladding per m²" },
      { category: "cladding", item: "metal_per_sqm", price: 18, unit: "per_sqm", description: "Metal cladding per m²" },
      { category: "cladding", item: "metal_fixed", price: 1070, unit: "fixed", description: "Metal cladding fixed cost" },
      
      // Fixed Costs
      { category: "fixed_costs", item: "site_survey", price: 170, unit: "fixed", description: "Site Survey" },
      { category: "fixed_costs", item: "design_fee", price: 225, unit: "fixed", description: "Design Fee" },
      { category: "fixed_costs", item: "gutter", price: 170, unit: "fixed", description: "Gutter" },
      { category: "fixed_costs", item: "waste_disposal", price: 300, unit: "fixed", description: "Waste Disposal" },
    ];

    for (const item of defaultPricing) {
      await ctx.db.insert("pricingConfig", item);
    }
  },
});

export const getPricingConfig = query({
  args: {},
  handler: async (ctx) => {
    const config = await ctx.db.query("pricingConfig").collect();
    const configMap: Record<string, Record<string, number>> = {};
    
    for (const item of config) {
      if (!configMap[item.category]) {
        configMap[item.category] = {};
      }
      configMap[item.category][item.item] = item.price;
    }
    
    return configMap;
  },
});

export const updatePricing = mutation({
  args: {
    category: v.string(),
    item: v.string(),
    price: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("pricingConfig")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .filter((q) => q.eq(q.field("item"), args.item))
      .first();
    
    if (existing) {
      await ctx.db.patch(existing._id, { price: args.price });
    } else {
      await ctx.db.insert("pricingConfig", {
        category: args.category,
        item: args.item,
        price: args.price,
      });
    }
  },
});
