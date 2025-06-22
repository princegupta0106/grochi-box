import React from "react";

const Policies = () => (
  <div className="max-w-3xl mx-auto p-10 bg-white rounded-2xl shadow-lg mt-12 mb-12 border border-gray-200">
    <h1 className="text-4xl font-extrabold mb-8 text-center text-navy-deep tracking-tight">Store Policies</h1>

    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-3 text-luxury-gold">Contact Us</h2>
      <div className="text-lg leading-relaxed">
        For any queries or support, please contact us at:
        <br />
        <strong>Phone:</strong> <a href="tel:+919999999999" className="text-blue-600 underline">+91 99999 99999</a>
        <br />
        <strong>Email:</strong> <a href="mailto:support@timepieceboutique.com" className="text-blue-600 underline">support@timepieceboutique.com</a>
      </div>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-3 text-luxury-gold">Shipping Policy</h2>
      <div className="text-lg leading-relaxed">
        We process and ship orders within 2-4 business days. Delivery times may vary based on your location. Tracking details will be provided once your order is shipped. We are not responsible for delays caused by courier services or unforeseen circumstances.
      </div>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-3 text-luxury-gold">Terms & Conditions</h2>
      <ul className="list-disc pl-6 text-lg leading-relaxed space-y-2">
        <li>By accessing or using our website, you agree to comply with and be bound by these terms and conditions.</li>
        <li>All products are subject to availability. We reserve the right to limit quantities or discontinue any product at any time.</li>
        <li>Prices for our products are subject to change without notice. We are not liable for any price changes or product unavailability.</li>
        <li>All product descriptions and images are for informational purposes only. Actual products may vary slightly.</li>
        <li>We reserve the right to refuse service to anyone for any reason at any time.</li>
        <li>By placing an order, you confirm that all information provided is accurate and complete.</li>
        <li>All payments are processed securely via Razorpay. We do not store your payment information.</li>
        <li>Any disputes arising from your use of our website or purchase of products will be governed by the laws of India.</li>
      </ul>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-3 text-luxury-gold">Cancellation & Refunds</h2>
      <div className="text-lg leading-relaxed">
        Orders can be cancelled within 24 hours of placement. To cancel, contact us via phone or email. Refunds are processed within 7 business days after cancellation or return approval. Products must be unused and in original packaging for returns. Shipping charges are non-refundable.
      </div>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-3 text-luxury-gold">Privacy Policy</h2>
      <div className="text-lg leading-relaxed">
        We value your privacy. Your personal information is used only for order processing and communication. We do not share your data with third parties except as required for payment and delivery. All payments are securely processed via Razorpay.
      </div>
    </section>
  </div>
);

export default Policies;
