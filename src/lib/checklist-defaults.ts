export interface ChecklistDefault {
  category: string;
  item: string;
  sortOrder: number;
}

export const CHECKLIST_DEFAULTS: ChecklistDefault[] = [
  // Cabinet Boxes (5)
  { category: "Cabinet Boxes", item: "Cabinets are plumb and level", sortOrder: 1 },
  { category: "Cabinet Boxes", item: "Cabinets are properly fastened", sortOrder: 2 },
  { category: "Cabinet Boxes", item: "Face frames are flush and aligned", sortOrder: 3 },
  { category: "Cabinet Boxes", item: "No visible damage to cabinet boxes", sortOrder: 4 },
  { category: "Cabinet Boxes", item: "Shelves are installed and level", sortOrder: 5 },

  // Doors (5)
  { category: "Doors", item: "Door alignment is consistent", sortOrder: 6 },
  { category: "Doors", item: "Doors open and close properly", sortOrder: 7 },
  { category: "Doors", item: "Doors seat fully when closed", sortOrder: 8 },
  { category: "Doors", item: "Soft-close operates correctly", sortOrder: 9 },
  { category: "Doors", item: "Overlay is consistent", sortOrder: 10 },

  // Drawers (5)
  { category: "Drawers", item: "Drawer slides operate smoothly", sortOrder: 11 },
  { category: "Drawers", item: "Drawers are properly aligned", sortOrder: 12 },
  { category: "Drawers", item: "Soft-close operates correctly", sortOrder: 13 },
  { category: "Drawers", item: "Drawer boxes are square", sortOrder: 14 },
  { category: "Drawers", item: "Drawer fronts are securely attached", sortOrder: 15 },

  // Hardware (5)
  { category: "Hardware", item: "Hardware placement is correct", sortOrder: 16 },
  { category: "Hardware", item: "Hardware is properly aligned", sortOrder: 17 },
  { category: "Hardware", item: "All hardware is secure", sortOrder: 18 },
  { category: "Hardware", item: "Specialty hardware is installed", sortOrder: 19 },
  { category: "Hardware", item: "Specialty hardware operates correctly", sortOrder: 20 },

  // Finish Quality (5)
  { category: "Finish Quality", item: "Finish is consistent across all pieces", sortOrder: 21 },
  { category: "Finish Quality", item: "No runs or drips", sortOrder: 22 },
  { category: "Finish Quality", item: "No visible defects in finish", sortOrder: 23 },
  { category: "Finish Quality", item: "Color matches approved sample", sortOrder: 24 },
  { category: "Finish Quality", item: "Sheen level is consistent", sortOrder: 25 },

  // Scribes & Fillers (4)
  { category: "Scribes & Fillers", item: "Scribes fit tightly to walls", sortOrder: 26 },
  { category: "Scribes & Fillers", item: "Fillers are properly sized", sortOrder: 27 },
  { category: "Scribes & Fillers", item: "Fillers are flush with cabinet faces", sortOrder: 28 },
  { category: "Scribes & Fillers", item: "End panels are properly installed", sortOrder: 29 },

  // Crown & Trim (5)
  { category: "Crown & Trim", item: "Crown joints are tight", sortOrder: 30 },
  { category: "Crown & Trim", item: "Crown is level", sortOrder: 31 },
  { category: "Crown & Trim", item: "Light rail is installed correctly", sortOrder: 32 },
  { category: "Crown & Trim", item: "All trim is securely fastened", sortOrder: 33 },
  { category: "Crown & Trim", item: "Miters are clean and tight", sortOrder: 34 },

  // Countertop (4)
  { category: "Countertop", item: "Countertop sits flush on cabinets", sortOrder: 35 },
  { category: "Countertop", item: "Backsplash is properly installed", sortOrder: 36 },
  { category: "Countertop", item: "Seams are tight and clean", sortOrder: 37 },
  { category: "Countertop", item: "Cutouts are properly finished", sortOrder: 38 },

  // Appliance Panels (4)
  { category: "Appliance Panels", item: "Panels are properly aligned", sortOrder: 39 },
  { category: "Appliance Panels", item: "Clearance is adequate", sortOrder: 40 },
  { category: "Appliance Panels", item: "Panels are securely fastened", sortOrder: 41 },
  { category: "Appliance Panels", item: "Appliance doors operate freely", sortOrder: 42 },

  // Toe Kicks (4)
  { category: "Toe Kicks", item: "Toe kicks are installed", sortOrder: 43 },
  { category: "Toe Kicks", item: "Toe kicks are properly aligned", sortOrder: 44 },
  { category: "Toe Kicks", item: "Joints are tight", sortOrder: 45 },
  { category: "Toe Kicks", item: "Finish matches cabinets", sortOrder: 46 },

  // Touch-up & Caulking (5)
  { category: "Touch-up & Caulking", item: "Nail holes are filled", sortOrder: 47 },
  { category: "Touch-up & Caulking", item: "Touch-up paint matches", sortOrder: 48 },
  { category: "Touch-up & Caulking", item: "Caulk lines are clean and straight", sortOrder: 49 },
  { category: "Touch-up & Caulking", item: "Caulk color is correct", sortOrder: 50 },
  { category: "Touch-up & Caulking", item: "No excess caulk or paint", sortOrder: 51 },

  // Cleanliness (4)
  { category: "Cleanliness", item: "Cabinet interiors are clean", sortOrder: 52 },
  { category: "Cleanliness", item: "Cabinet exteriors are wiped down", sortOrder: 53 },
  { category: "Cleanliness", item: "Protective film is removed", sortOrder: 54 },
  { category: "Cleanliness", item: "Jobsite is clean", sortOrder: 55 },
];
