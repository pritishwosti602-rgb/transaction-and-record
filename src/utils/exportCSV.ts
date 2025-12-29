import Papa from "papaparse"

export const exportCSV = (data: any[], filename: string) => {
  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
}
