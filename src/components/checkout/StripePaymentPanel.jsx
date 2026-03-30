// Stripe payment panel — commented out
// Uncomment and restore imports in checkout/index.jsx to re-enable.

// import React, { useState } from 'react';
// import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import Money from '../general/money';
//
// const StripePaymentPanel = ({ grandTotal, onSuccess, onBack }) => {
//     const stripe = useStripe();
//     const elements = useElements();
//     const [errorMessage, setErrorMessage] = useState(null);
//     const [processing, setProcessing] = useState(false);
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!stripe || !elements) return;
//
//         setProcessing(true);
//         setErrorMessage(null);
//
//         const { error } = await stripe.confirmPayment({
//             elements,
//             confirmParams: {
//                 return_url: window.location.origin + '/checkout',
//             },
//             redirect: 'if_required',
//         });
//
//         if (error) {
//             setErrorMessage(error.message || 'Payment failed. Please try again.');
//             setProcessing(false);
//         } else {
//             onSuccess();
//         }
//     };
//
//     return (
//         <div className="wizard-panel">
//             <h3 className="step-title">Payment</h3>
//
//             <div className="stripe-test-banner">
//                 <p className="eyebrow">Test mode</p>
//                 <p className="tiny">
//                     Use card <strong>4242 4242 4242 4242</strong> · Any future date · Any 3-digit CVC · Any postal code
//                 </p>
//             </div>
//
//             <form onSubmit={handleSubmit}>
//                 <div className="stripe-element-wrap">
//                     <PaymentElement options={{ layout: 'tabs' }} />
//                 </div>
//
//                 {errorMessage && (
//                     <p className="error stripe-error" role="alert">{errorMessage}</p>
//                 )}
//
//                 <div className="form-actions wizard-actions">
//                     <button className="btn ghost" type="button" onClick={onBack} disabled={processing}>
//                         Back
//                     </button>
//                     <button className="btn primary" type="submit" disabled={!stripe || processing}>
//                         {processing ? 'Processing…' : (
//                             <>Pay <Money cost={grandTotal} /></>
//                         )}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };
//
// export default StripePaymentPanel;
