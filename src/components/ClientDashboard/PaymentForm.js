import React, { useState } from "react";
import "./PaymentForm.css";
import { baseUrl } from "../../utils";
import axios from "axios";
import { ScaleLoader } from "react-spinners";

function PaymentForm({
  totalAmount,
  onClose,
  bookingData,
  setNotification,
  updateSpaceStatus,
}) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutRequestID, setCheckoutRequestID] = useState("");
  const [errors, setErrors] = useState([]);
  // const [isPaid, setIsPaid] = useState(false);
  //   console.log(bookingData);
  const { id } = bookingData;

  // const paymentDate = new Date().toISOString();

  function handleUpdateBookingStatus() {
    axios
      .patch(
        `${baseUrl}/bookings/${id}`,
        {
          status: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
      });
  }

  const handleCheckOutToPayment = () => {
    // Simulate payment processing (replace with actual payment integration)
    setIsLoading(true);
    axios
      .post(
        `${baseUrl}/stkpush`,
        {
          amount: totalAmount,
          booking_id: id,
          phoneNumber: phoneNumber,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setIsLoading(false);
        const [result, responseData] = response.data; // Destructure the result and data
        if (result === "success") {
          // Handle success

          const newCheckoutRequestID = responseData.CheckoutRequestID;
          setCheckoutRequestID(newCheckoutRequestID);
          console.log(newCheckoutRequestID);
          console.log(responseData);
        } else if (result === "error") {
          // Handle error
          const { errorMessage } = responseData;
          console.log(errorMessage);
          setErrors(errorMessage);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error creating booking:", error);
        setErrors(error.response.data.errors);
      });
  };

  function handleConfirmPayment() {
    handleSuccessPayment();
  }

  console.log(errors);

  function handleSuccessPayment() {
    setIsLoading(true);
    axios
      .post(
        `${baseUrl}/stkquery`,
        {
          checkoutRequestID,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setIsLoading(false);
        const [result, responseData] = response.data; // Destructure the result and data
        if (result === "success") {
          // Handle success
          updateSpaceStatus();
          handleUpdateBookingStatus();
          setIsLoading(false);
          setNotification("Payment successful!");
          setTimeout(() => {
            setNotification(null);
          }, 3000);
          console.log(response);

          onClose();
        } else if (result === "error") {
          // Handle error
          const { errorMessage } = responseData;
          console.log(errorMessage);
          setErrors(errorMessage);
        }
      });
  }

  if (checkoutRequestID)
    return (
      <div className="payment-form">
        {errors && <p className="payment-errors">{errors}</p>}
        <button
          className="confirm-btn payment-btn btn-submit"
          onClick={handleConfirmPayment}
        >
          {isLoading ? (
            <ScaleLoader height={8} color="#fff" />
          ) : (
            "Confirm Payment"
          )}
        </button>
      </div>
    );

  return (
    <div className="payment-form">
      <h1>Payment</h1>
      <p>Total Amount: KSH {totalAmount}</p>{" "}
      {/* Replace with actual total amount */}
      <label>Phone Number:</label>
      <input
        type="number"
        placeholder="254123456789"
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      {/* {errors.map((error, index) => (
        <p key={index} className="payment-errors">
          {error}
        </p>
      ))} */}
      {errors && (
        <p className="payment-errors">
          Phone Number should not be empty and should start with 254
        </p>
      )}
      <button
        className="payment-btn btn-submit"
        onClick={handleCheckOutToPayment}
      >
        {isLoading ? <ScaleLoader height={8} color="#fff" /> : "Pay"}
      </button>
    </div>
  );
}

export default PaymentForm;
