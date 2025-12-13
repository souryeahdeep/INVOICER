const printStyles = `
  @media print {
    html,
    body {
      margin: 0;
      padding: 0;
      background: white !important;
    }
    .print-wrapper {
      min-height: auto !important;
      margin: 0;
      padding: 0;
    }
    .print-wrapper table {
      page-break-inside: avoid;
    }
    .print-wrapper .flex {
      page-break-inside: avoid;
    }
  }
`;

const InvoicePreview = ({ data, onEdit }) => {
  const { formData, products, totals } = data;

  const handlePrint = () => window.print();

  const formatCurrency = (value) => `₹${Number(value || 0).toFixed(2)}`;

  return (
    <>
      <style>{printStyles}</style>
      <div className="print-wrapper min-h-screen bg-[#f3f4f6] py-10 px-4 print:bg-white print:py-0 print:px-0 print:min-h-auto">
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap gap-3 justify-between print:hidden">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-2 bg-white text-gray-900 border border-gray-300 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition"
        >
          <span className="text-lg">←</span>
          Edit Invoice
        </button>
        <button
          type="button"
          onClick={handlePrint}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow hover:bg-black transition"
        >
          Print / Download
        </button>
      </div>

      <div className="relative max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none print:max-w-full">
        <div
          className="absolute -bottom-20 -right-16 w-72 h-72 bg-linear-to-br from-gray-200 via-gray-100 to-white rounded-full opacity-70 pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute -bottom-28 -left-10 w-80 h-80 bg-linear-to-tr from-gray-100 via-white to-gray-200 rounded-[45%] opacity-70 pointer-events-none"
          aria-hidden
        />

        <div className="relative z-10 px-10 pb-10 pt-12 space-y-8 text-gray-900 print:px-6 print:pb-6 print:pt-8 print:space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start text-sm font-semibold tracking-wide text-gray-500">
            <div>
              <p className="text-lg font-bold text-gray-900">TAX INVOICE</p>
            </div>
            <div className="text-right">
              <p className="uppercase text-xs mb-1">No.</p>
              <p className="text-base font-bold text-gray-900">
                {formData.billNo || "000001"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-5xl font-black tracking-tight text-gray-900">
              {formData.industryName || "GANGULY INDUSTRIES"}
            </p>
            <p className="mt-1 text-lg text-black">
              {formData.companyAddress || "24 GT ROAD, ANGUS , HOOGHLY - 712221"}
            </p>
            <p className="text-lg text-black">
              GSTIN: {formData.gstinNumber || "19APGJPG6443J2Z2"}
            </p>
            <p className="text-lg text-black">
              UAN: {formData.uanNumber || "UAN Number"}
            </p>
             <p className="text-lg text-gray-900">
                Mobile No : {formData.mobileNumber || "9830520044"}
              </p>
            <p className="mt-2 text-sm text-gray-500">
              <span className="font-semibold text-gray-700">Date:</span>
              <span className="ml-2 text-gray-900">
                {formData.invoiceDate || new Date().toLocaleDateString()}
              </span>
            </p>
                
             
          </div>

          {/* Parties */}
          <div style={{ display: "flex", gap: "2rem" }} className="text-sm">
            <div style={{ flex: 1 }}>
              <p className="font-semibold text-gray-900">Billed to:</p>
              <p className="mt-1 text-gray-800">
                {formData.buyerName || "M/S INTERNATIONAL COMBUSTION (INDIA) LTD."}
              </p>
              <p className="text-gray-500 text-sm">
                {formData.buyerAddress || "Buyer address line"}
              </p>
              <p className="text-gray-500 text-sm">
                {formData.buyerEmail || "buyer@email.com"}
              </p>
              
            </div>
           
          </div>

          {/* Table */}
          <div className="w-full">
            <table className="w-full border-collapse text-sm rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wide">
                  <th className="text-left px-4 py-3">
                    Description of Product
                  </th>
                  <th className="text-center px-4 py-3">Quantity</th>
                  <th className="text-center px-4 py-3">HSN/SAC</th>
                  <th className="text-right px-4 py-3">Price</th>
                  <th className="text-right px-4 py-3">Amount</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100">
                    <td className="px-4 py-3">
                      {product.name || "Item description"}
                    </td>
                    <td className="text-center px-4 py-3">
                      {product.quantity}
                    </td>
                    <td className="text-center px-4 py-3">
                      {product.hsnSac || "HSN/SAC"}
                    </td>
                    <td className="text-right px-4 py-3">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="text-right px-4 py-3 font-semibold">
                      {formatCurrency(product.quantity * product.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end border-t border-gray-200 pt-4 mt-4">
              <div className="w-60 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(totals.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>CGST @ {formData.cgstRate || 0}%</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(totals.cgst)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>SGST @ {formData.sgstRate || 0}%</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(totals.sgst)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Round Off</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(totals.roundOff)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-gray-900">
                  <span>Grand Total</span>
                  <span>{formatCurrency(totals.grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer info */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
            className="text-sm text-gray-600"
          >
            <div className="space-y-2">
              <p>
                <span className="font-semibold text-gray-800">Rupees:</span>
                <span className="ml-2 text-gray-700">
                  {formData.rupeesText}
                </span>
              </p>
              
              {formData.orderNo && (
                <p>
                  <span className="font-semibold text-gray-800">Order No:</span>
                  <span className="ml-2 text-gray-700">{formData.orderNo}</span>
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                For {formData.industryName || "Ganguly Industries"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default InvoicePreview;
