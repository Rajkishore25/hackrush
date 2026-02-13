import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateScanInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

// === HOOKS FOR SCANS ===

export function useScans() {
  return useQuery({
    queryKey: [api.scans.list.path],
    queryFn: async () => {
      const res = await fetch(api.scans.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch scans");
      return api.scans.list.responses[200].parse(await res.json());
    },
  });
}

export function useScan(id: number) {
  return useQuery({
    queryKey: [api.scans.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.scans.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch scan details");
      return api.scans.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateScan() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (data: CreateScanInput) => {
      const res = await fetch(api.scans.create.path, {
        method: api.scans.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.scans.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create scan");
      }
      return api.scans.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.scans.list.path] });
      toast({
        title: "Analysis Complete",
        description: "The content has been successfully analyzed for fraud.",
      });
      setLocation(`/scan/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useGenerateReport() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (scanId: number) => {
      const url = buildUrl(api.reports.generate.path, { id: scanId });
      const res = await fetch(url, {
        method: api.reports.generate.method,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to generate report");
      return api.reports.generate.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      toast({
        title: "Report Generated",
        description: "PDF report is ready for download.",
      });
      // In a real app, this would trigger a download
      window.open(data.url, "_blank");
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
