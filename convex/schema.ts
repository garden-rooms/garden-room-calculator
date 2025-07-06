import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  quotes: defineTable({
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
    status: v.string(), // "draft", "saved", "survey_requested"
  }),
  
  pricingConfig: defineTable({
    category: v.string(),
    item: v.string(),
    price: v.number(),
    unit: v.optional(v.string()),
    description: v.optional(v.string()),
  }).index("by_category", ["category"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
