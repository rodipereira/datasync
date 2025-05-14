
/// <reference types="vite/client" />

// Add jspdf-autotable types
import "jspdf-autotable";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}
