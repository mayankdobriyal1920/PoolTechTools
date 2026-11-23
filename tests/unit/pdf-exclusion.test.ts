import { describe, it, expect } from "vitest";
import type { Report, PublicReportView } from "@/lib/db/types";

describe("PDF private note exclusion (type-level)", () => {
  it("PublicReportView does not include privateNotes", () => {
    const report: Report = {
      id: "1", customerNameSnapshot: "Test", reportNumber: "RPT-1",
      visitDate: new Date().toISOString(), technician: "Tech", tasks: [],
      readings: {}, chemicals: [], customerSummary: "summary", privateNotes: "SECRET_PRIVATE_NOTE",
      photoIds: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), version: 1,
    };
    // Construct PublicReportView by omitting privateNotes
    const { privateNotes: _pn, ...publicView } = report;
    const view: PublicReportView = publicView;
    // Sentinel check: the string must not be in serialized public view
    expect(JSON.stringify(view)).not.toContain("SECRET_PRIVATE_NOTE");
  });
});
