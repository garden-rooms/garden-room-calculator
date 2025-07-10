import { action } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "@convex-dev/resend";
import { components } from "./_generated/api";

export const resend: Resend = new Resend(components.resend, {
	testMode: false
});

export const sendEmail = action({
  args: {
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.optional(v.string()),
    message: v.optional(v.string()),
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
  },
  handler: async (ctx, args) => {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }

    // const resend = new Resend(process.env.RESEND_API_KEY);

    const formatDoorType = (doorType: string) => {
      return doorType.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatCladding = (cladding: string) => {
      return cladding.charAt(0).toUpperCase() + cladding.slice(1);
    };

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background-color: #20232A; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .section { margin-bottom: 30px; }
          .config-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
          .price-breakdown { background-color: #f5f5f5; padding: 20px; border-radius: 8px; }
          .price-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
          .total-row { font-weight: bold; font-size: 1.2em; color: #D4AF37; border-top: 2px solid #D4AF37; padding-top: 8px; }
          .customer-info { background-color: #f9f9f9; padding: 15px; border-radius: 8px; }
          @media (max-width: 600px) { .config-grid { grid-template-columns: 1fr; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>New Garden Room Enquiry</h1>
          <p>Received: ${new Date().toLocaleString('en-GB')}</p>
        </div>
        
        <div class="content">
          <div class="section customer-info">
            <h2>Customer Information</h2>
            <p><strong>Name:</strong> ${args.customerName}</p>
            <p><strong>Email:</strong> ${args.customerEmail}</p>
            ${args.customerPhone ? `<p><strong>Phone:</strong> ${args.customerPhone}</p>` : ''}
            ${args.message ? `<p><strong>Message:</strong><br>${args.message}</p>` : ''}
          </div>

          <div class="section">
            <h2>Garden Room Configuration</h2>
            <div class="config-grid">
              <div>
                <p><strong>Size:</strong> ${args.configuration.length}m × ${args.configuration.depth}m</p>
                <p><strong>Floor Area:</strong> ${args.configuration.floorArea}m²</p>
                <p><strong>Wall Area:</strong> ${args.configuration.wallArea}m²</p>
                <p><strong>Roof Area:</strong> ${args.configuration.roofArea}m²</p>
              </div>
              <div>
                <p><strong>Laminated Floor:</strong> ${args.configuration.laminatedFloor ? 'Yes' : 'No'}</p>
                <p><strong>Skimmed Finish:</strong> ${args.configuration.skimmedFinish ? 'Yes' : 'No'}</p>
                <p><strong>Ceiling Lights:</strong> ${args.configuration.ceilingLights}</p>
                <p><strong>Double Sockets:</strong> ${args.configuration.doubleSockets}</p>
              </div>
            </div>
            
            <div class="config-grid">
              <div>
                <p><strong>Door Type:</strong> ${formatDoorType(args.configuration.doorType)}</p>
                <p><strong>ALU Windows:</strong> ${args.configuration.windows.aluWindows}</p>
                <p><strong>UPVC Windows:</strong> ${args.configuration.windows.upvcWindows}</p>
                <p><strong>Roof Windows:</strong> ${args.configuration.windows.roofWindows}</p>
              </div>
              <div>
                <p><strong>Front Cladding:</strong> ${formatCladding(args.configuration.frontCladding)}</p>
                <p><strong>Side/Rear Cladding:</strong> ${formatCladding(args.configuration.sideRearCladding)}</p>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Price Breakdown</h2>
            <div class="price-breakdown">
              <div class="price-row">
                <span>Garden Room Shell (inc. fixed costs):</span>
                <span>£${args.priceBreakdown.gardenRoomShell.toLocaleString()}</span>
              </div>
              ${args.priceBreakdown.laminatedFloor > 0 ? `
                <div class="price-row">
                  <span>Laminated Flooring:</span>
                  <span>£${args.priceBreakdown.laminatedFloor.toLocaleString()}</span>
                </div>
              ` : ''}
              ${args.priceBreakdown.skimmedFinish > 0 ? `
                <div class="price-row">
                  <span>Skimmed Finish:</span>
                  <span>£${args.priceBreakdown.skimmedFinish.toLocaleString()}</span>
                </div>
              ` : ''}
              <div class="price-row">
                <span>Electrical:</span>
                <span>£${args.priceBreakdown.electricals.toLocaleString()}</span>
              </div>
              <div class="price-row">
                <span>Doors:</span>
                <span>£${args.priceBreakdown.doors.toLocaleString()}</span>
              </div>
              ${args.priceBreakdown.windows > 0 ? `
                <div class="price-row">
                  <span>Windows:</span>
                  <span>£${args.priceBreakdown.windows.toLocaleString()}</span>
                </div>
              ` : ''}
              <div class="price-row">
                <span>Cladding:</span>
                <span>£${args.priceBreakdown.cladding.toLocaleString()}</span>
              </div>
              <div class="price-row">
                <span><strong>Subtotal (ex VAT):</strong></span>
                <span><strong>£${args.priceBreakdown.subtotal.toLocaleString()}</strong></span>
              </div>
              <div class="price-row">
                <span>VAT (20%):</span>
                <span>£${args.priceBreakdown.vat.toLocaleString()}</span>
              </div>
              <div class="price-row total-row">
                <span>TOTAL (inc VAT):</span>
                <span>£${args.priceBreakdown.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      console.log("Attempting to send email with Resend...");
      console.log("✅ RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);
			console.log(resend)
      const data = await resend.sendEmail(
				ctx,
        "Garden Room Enquiries <contact@qualityoutdoorrooms.co.uk>",
        "qualityoutdoorrooms@gmail.com",
        `New Garden Room Enquiry from ${args.customerName}`,
        emailHtml,
      );


      console.log("Email sent successfully:", data);
      return { success: true,  };
    } catch (error) {
      console.error("Email sending failed:", error);
      throw new Error(`Failed to send enquiry email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});
