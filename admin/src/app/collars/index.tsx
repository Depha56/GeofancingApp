import { useCollars } from "@/hooks/use-collars";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { db } from "@/lib/config";
import { doc, getDoc } from "firebase/firestore";

export default function CollarsPage() {
  const { collarIds, loading, refreshCollarIds } = useCollars();
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<"all" | "assigned" | "unassigned">("all");

  // Fetch assignments from Firestore on mount and when collarIds change
  useEffect(() => {
    const fetchAssignments = async () => {
      const result: Record<string, string> = {};
      for (const collarId of collarIds) {
        const ref = doc(db, "collars", collarId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (data.assignedFarmId) {
            result[collarId] = data.assignedFarmId;
          }
        }
      }
      setAssignments(result);
    };
    if (collarIds.length > 0) {
      fetchAssignments();
    }
  }, [collarIds]);

  // Filtering logic
  const filteredCollarIds = collarIds.filter((collarId) => {
    if (filter === "assigned") return !!assignments[collarId];
    if (filter === "unassigned") return !assignments[collarId];
    return true;
  });

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Collar Management</h1>
              <p className="text-muted-foreground">
                View, assign, and manage collars for your livestock.
              </p>
            </div>
            <Button variant="outline" onClick={refreshCollarIds} disabled={loading}>
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
          {/* Filter Buttons */}
          <div className="px-4 lg:px-6 flex gap-2 mb-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "assigned" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("assigned")}
            >
              Assigned
            </Button>
            <Button
              variant={filter === "unassigned" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("unassigned")}
            >
              Unassigned
            </Button>
          </div>
          <div className="px-4 lg:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCollarIds.length === 0 && !loading && (
                <div className="col-span-full text-center text-muted-foreground py-8">
                  No collars found.
                </div>
              )}
              {filteredCollarIds.map((collarId) => (
                <Card key={collarId}>
                  <CardHeader>
                    <CardTitle>Collar ID: <span className="font-mono">{collarId}</span></CardTitle>
                    <CardDescription>
                      Assigned Farm:
                      <span className="font-semibold text-primary ml-2">
                        {assignments[collarId] || <span className="italic text-gray-400">Unassigned</span>}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* No edit/assign UI here */}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}