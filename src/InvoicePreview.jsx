import React from 'react';

export default function InvoicePreview({ data, onEdit }) {
  const { formData, products, totals } = data;

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (value) => `₹${Number(value || 0).toFixed(2)}`;

  return (
    <>
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
          .invoice-container {
            width: 100%;
            height: 100vh;
            margin: 0;
            padding: 20mm 15mm;
            box-sizing: border-box;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
        
        @media screen {
          .invoice-container {
            width: 210mm;
            min-height: 297mm;
            margin: 20px auto;
            padding: 20mm 15mm;
            box-sizing: border-box;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
        }
      `}</style>

      <div className="no-print fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors shadow-lg"
        >
          ← Edit Invoice
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
        >
          Print Invoice
        </button>
      </div>

      <div className="invoice-container">
        <div className="border-2 border-black h-full flex flex-col">
          {/* Header */}
          <div className="border-b-2 border-black p-3 flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold mb-2">TAX INVOICE</h1>
            </div>
            <div className="text-right">
              <div className="text-sm">NO.</div>
              <div className="font-semibold">{formData.billNo || '000001'}</div>
            </div>
          </div>

          {/* Seller Info */}
          <div className="border-b-2 border-black p-3">
            <h2 className="text-2xl font-bold text-blue-800 mb-2">{formData.industryName || 'GANGULY INDUSTRIES'}</h2>
            <div className="text-sm space-y-1">
              <div>{formData.companyAddress || '24 GT ROAD, ANGUS, HOOGHLY - 712221'}</div>
              <div>GSTIN: {formData.gstinNumber || '19AGJPG6443J2Z2'}</div>
              <div>UAN: {formData.uanNumber || 'UAN Number'}</div>
              <div>Mobile No: {formData.mobileNumber || '9830520044'}</div>
              <div>Date: {formData.invoiceDate || new Date().toLocaleDateString()}</div>
            </div>
          </div>

          {/* Buyer Info */}
          <div className="border-b-2 border-black p-3">
            <div className="text-sm">
              <div className="mb-1">Billed to:</div>
              <div className="font-semibold">{formData.buyerName || 'Buyer Name'}</div>
              <div>{formData.buyerAddress || 'Buyer Address'}</div>
              <div>GSTIN: {formData.buyerGstin || 'Buyer GSTIN'}</div>
            </div>
          </div>

          {/* Items Table */}
          <div className="flex-1 flex flex-col">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-200 border-b-2 border-black">
                  <th className="border-r-2 border-black p-2 text-left font-semibold text-blue-700">DESCRIPTION OF PRODUCT</th>
                  <th className="border-r-2 border-black p-2 text-center font-semibold w-20">QUANTITY</th>
                  <th className="border-r-2 border-black p-2 text-center font-semibold w-24">HSN/SAC</th>
                  <th className="border-r-2 border-black p-2 text-center font-semibold w-24">PRICE</th>
                  <th className="p-2 text-center font-semibold w-28">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.id} className="border-b border-black">
                    <td className="border-r-2 border-black p-2">{product.name || 'Product description'}</td>
                    <td className="border-r-2 border-black p-2 text-center">{product.quantity}</td>
                    <td className="border-r-2 border-black p-2 text-center">{product.hsnSac || 'HSN/SAC'}</td>
                    <td className="border-r-2 border-black p-2 text-right">{formatCurrency(product.price)}</td>
                    <td className="p-2 text-right font-semibold">{formatCurrency(product.quantity * product.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals Section */}
            <div className="mt-auto print:mt-0">
              <table className="w-full border-collapse text-sm">
                <tbody>
                  <tr className="border-b border-black bg-gray-100">
                    <td className="border-r-2 border-black px-2 pl-37 text-right font-semibold">Total</td>
                    <td className="p-2 text-right font-bold">{formatCurrency(totals.subtotal)}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-r-2 border-black p-2 text-right">CGST @ {formData.cgstRate || 0}%</td>
                    <td className="p-2 text-right">{formatCurrency(totals.cgst)}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-r-2 border-black p-2 text-right">SGST @ {formData.sgstRate || 0}%</td>
                    <td className="p-2 text-right">{formatCurrency(totals.sgst)}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-r-2 border-black p-2 text-right">Round Off</td>
                    <td className="p-2 text-right">{formatCurrency(totals.roundOff)}</td>
                  </tr>
                  <tr className="bg-gray-200">
                    <td className="border-r-2 border-black p-2 text-right font-bold">Grand Total</td>
                    <td className="p-2 text-right font-bold text-lg">{formatCurrency(totals.grandTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="border-t-2 border-black p-3 flex justify-between items-start text-sm">
              <div className="space-y-1">
                <div>
                  <span className="font-semibold text-gray-800">Rupees:</span>
                  <span className="ml-2 text-gray-700">{formData.rupeesText || totals.amountInWords}</span>
                </div>
                {formData.orderNo && (
                  <div>
                    <span className="font-semibold text-gray-800">Order No:</span>
                    <span className="ml-2 text-gray-700">{formData.orderNo}</span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">For {formData.industryName || 'Ganguly Industries'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}