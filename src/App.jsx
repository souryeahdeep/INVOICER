import { useState } from 'react';
import InvoicePreview from './InvoicePreview';

function App() {
  const [formData, setFormData] = useState({
    industryName: '',
    companyAddress: '',
    uanNumber: '',
    gstinNumber: '',
    mobileNumber: '',
    billNo: '',
    buyerName: '',
    buyerAddress: '',
    hsnSac: '',

    buyerGstin: '',
    cgstRate: 9,
    sgstRate: 9,
    orderNo: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    rupeesText: '',
  });

  const [products, setProducts] = useState([
    { id: 1, name: '', hsnSac: '', quantity: 1, price: 0 }
  ]);

  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductChange = (id, field, value) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, [field]: value } : product
    ));
  };

  const addProduct = () => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    setProducts(prev => [...prev, { id: newId, name: '', hsnSac: '', quantity: 1, price: 0 }]);
  };

  const removeProduct = (id) => {
    if (products.length > 1) {
      setProducts(prev => prev.filter(product => product.id !== id));
    }
  };

  const calculateTotal = () => {
    return products.reduce((sum, product) => sum + (product.quantity * product.price), 0);
  };

  const calculateCGST = () => {
    return (calculateTotal() * parseFloat(formData.cgstRate || 0)) / 100;
  };

  const calculateSGST = () => {
    return (calculateTotal() * parseFloat(formData.sgstRate || 0)) / 100;
  };

  const calculateGrandTotal = () => {
    const total = calculateTotal() + calculateCGST() + calculateSGST();
    return Math.round(total);
  };

  const calculateRoundOff = () => {
    const total = calculateTotal() + calculateCGST() + calculateSGST();
    return Math.round(total) - total;
  };

  // Convert number to words (Indian numbering system)
  const numberToWords = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
      'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (num === 0) return 'Zero Rupees Only';

    const convertLessThanThousand = (n) => {
      if (n === 0) return '';
      if (n < 20) return ones[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
      return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertLessThanThousand(n % 100) : '');
    };

    const convert = (n) => {
      if (n < 1000) return convertLessThanThousand(n);
      if (n < 100000) return convertLessThanThousand(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + convertLessThanThousand(n % 1000) : '');
      if (n < 10000000) return convertLessThanThousand(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + convert(n % 100000) : '');
      return convertLessThanThousand(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + convert(n % 10000000) : '');
    };

    return convert(Math.abs(Math.round(num))) + ' Rupees Only';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subtotal = calculateTotal();
    const cgst = calculateCGST();
    const sgst = calculateSGST();
    const roundOff = calculateRoundOff();
    const grandTotal = calculateGrandTotal();
    const amountInWords = numberToWords(grandTotal);

    const updatedFormData = {
      ...formData,
      rupeesText: amountInWords,
    };

    setFormData(updatedFormData);

    setPreviewData({
      formData: updatedFormData,
      products: products.map((product) => ({ ...product })),
      totals: {
        subtotal,
        cgst,
        sgst,
        roundOff,
        grandTotal,
        amountInWords,
      },
    });
    setShowPreview(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToForm = () => {
    setShowPreview(false);
  };

  if (showPreview && previewData) {
    return (
      <InvoicePreview
        data={previewData}
        onEdit={handleBackToForm}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Invoice Form
          </h1>

          <form onSubmit={handleSubmit}>
            {/* Business Details Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                Business Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Industry Name
                  </label>
                  <input
                    type="text"
                    name="industryName"
                    value={formData.industryName}
                    onChange={handleFormChange}
                    placeholder="Enter industry name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Company Address
                  </label>
                  <input
                    type="text"
                    name="companyAddress"
                    value={formData.companyAddress}
                    onChange={handleFormChange}
                    placeholder="Enter company address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    UAN Number
                  </label>
                  <input
                    type="text"
                    name="uanNumber"
                    value={formData.uanNumber}
                    onChange={handleFormChange}
                    placeholder="Enter UAN number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    GSTIN Number
                  </label>
                  <input
                    type="text"
                    name="gstinNumber"
                    value={formData.gstinNumber}
                    onChange={handleFormChange}
                    placeholder="Enter GSTIN number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleFormChange}
                    placeholder="Enter mobile number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Bill No
                  </label>
                  <input
                    type="text"
                    name="billNo"
                    value={formData.billNo}
                    onChange={handleFormChange}
                    placeholder="Enter bill number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Buyer's Details Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                Buyer's Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Buyer's Name
                  </label>
                  <input
                    type="text"
                    name="buyerName"
                    value={formData.buyerName}
                    onChange={handleFormChange}
                    placeholder="Enter buyer's name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Buyer's GSTIN
                  </label>
                  <input
                    type="text"
                    name="buyerGstin"
                    value={formData.buyerGstin}
                    onChange={handleFormChange}
                    placeholder="Enter buyer's GSTIN"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Buyer's Address
                  </label>
                  <textarea
                    name="buyerAddress"
                    value={formData.buyerAddress}
                    onChange={handleFormChange}
                    placeholder="Enter buyer's address"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-y"
                  />
                </div>
              </div>
            </div>

            {/* Products Table Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-xl font-semibold text-gray-700">
                  Products
                </h2>
                <button
                  type="button"
                  onClick={addProduct}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                >
                  <span className="text-xl">+</span> Add Product
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700 w-16">
                        S.No
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Description of Product
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700 w-28">
                        HSN/SAC
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700 w-28">
                        Quantity
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700 w-32">
                        Price (₹)
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700 w-32">
                        Amount (₹)
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700 w-20">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 text-center text-gray-600">
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          <input
                            type="text"
                            value={product.name}
                            onChange={(e) => handleProductChange(product.id, 'name', e.target.value)}
                            placeholder="Product name"
                            className="w-full px-2 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          <input
                            type="text"
                            value={product.hsnSac}
                            onChange={(e) => handleProductChange(product.id, 'hsnSac', e.target.value)}
                            placeholder="HSN/SAC"
                            className="w-full px-2 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          <input
                            type="number"
                            min="1"
                            value={product.quantity}
                            onChange={(e) => handleProductChange(product.id, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={product.price}
                            onChange={(e) => handleProductChange(product.id, 'price', parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right font-medium text-gray-700">
                          ₹{(product.quantity * product.price).toFixed(2)}
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => removeProduct(product.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={products.length === 1}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50">
                      <td colSpan="5" className="border border-gray-300 px-4 py-2 text-right font-semibold text-gray-700">
                        Total:
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right font-semibold text-gray-700">
                        ₹{calculateTotal().toFixed(2)}
                      </td>
                      <td className="border border-gray-300"></td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td colSpan="5" className="border border-gray-300 px-4 py-2 text-right text-gray-700">
                        <div className="flex items-center justify-end gap-2">
                          <span>CGST @</span>
                          <input
                            type="number"
                            name="cgstRate"
                            value={formData.cgstRate}
                            onChange={handleFormChange}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            min="0"
                            step="0.1"
                          />
                          <span>%</span>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right text-gray-700">
                        ₹{calculateCGST().toFixed(2)}
                      </td>
                      <td className="border border-gray-300"></td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td colSpan="5" className="border border-gray-300 px-4 py-2 text-right text-gray-700">
                        <div className="flex items-center justify-end gap-2">
                          <span>SGST @</span>
                          <input
                            type="number"
                            name="sgstRate"
                            value={formData.sgstRate}
                            onChange={handleFormChange}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            min="0"
                            step="0.1"
                          />
                          <span>%</span>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right text-gray-700">
                        ₹{calculateSGST().toFixed(2)}
                      </td>
                      <td className="border border-gray-300"></td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td colSpan="5" className="border border-gray-300 px-4 py-2 text-right text-gray-700">
                        Round Off:
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right text-gray-700">
                        ₹{calculateRoundOff().toFixed(2)}
                      </td>
                      <td className="border border-gray-300"></td>
                    </tr>
                    <tr className="bg-gray-100">
                      <td colSpan="5" className="border border-gray-300 px-4 py-3 text-right font-bold text-gray-800">
                        Grand Total:
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-right font-bold text-green-600 text-lg">
                        ₹{calculateGrandTotal().toFixed(2)}
                      </td>
                      <td className="border border-gray-300"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Invoice Footer - Rupees, Order, Date, Signature */}
              <div className="mt-4 border border-gray-300 rounded-lg">
                {/* Rupees in Words Row */}
                <div className="flex border-b border-gray-300">
                  <div className="flex-1 px-4 py-3 border-r border-gray-300">
                    <span className="block text-sm font-semibold text-gray-700 mb-1">Rupees (in words)</span>
                    <span className="text-gray-600 italic">
                      {formData.rupeesText || numberToWords(calculateGrandTotal())}
                    </span>
                  </div>
                  <div className="w-48 px-4 py-3 text-right">
                    <span className="font-semibold text-gray-700 italic">For {formData.industryName || 'Company Name'}</span>
                  </div>
                </div>

                {/* Order, Date, Signature Row */}
                <div className="flex">
                  <div className="flex-1 flex">
                    <div className="flex-1 px-4 py-3 border-r border-gray-300">
                      <div className="flex items-center gap-2">
                        <label className="font-semibold text-gray-700">Order:</label>
                        <input
                          type="text"
                          name="orderNo"
                          value={formData.orderNo}
                          onChange={handleFormChange}
                          placeholder="Order number"
                          className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex-1 px-4 py-3 border-r border-gray-300">
                      <div className="flex items-center gap-2">
                        <label className="font-semibold text-gray-700">Date:</label>
                        <input
                          type="date"
                          name="invoiceDate"
                          value={formData.invoiceDate}
                          onChange={handleFormChange}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-48 px-4 py-3 flex items-center justify-center">
                    <span className="text-gray-500 italic">Signature</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
              >
                Generate Invoice
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;