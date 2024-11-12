import { FaTrash, FaCheck } from "react-icons/fa";

const PaymentCard = ({ payment, onMarkAsDone, onDelete }) => {
  const isPendingOrFailed =
    payment.status === "pending" || payment.status === "failed";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-white">{payment.note}</h2>
            <p className="text-white text-opacity-80 text-sm">
              {new Date(payment.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">
              ₹{payment.totalAmount}
            </p>
            <p
              className={`text-sm font-medium ${
                payment.status === "completed"
                  ? "text-green-300"
                  : payment.status === "failed"
                  ? "text-red-300"
                  : "text-yellow-300"
              }`}
            >
              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
            </p>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-gray-600">
            {payment.category ? payment.category.name : "Uncategorized"}
          </p>
          {isPendingOrFailed && (
            <div className="flex space-x-2">
              <button
                onClick={() => onMarkAsDone(payment._id)}
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300"
                title="Mark as Done"
              >
                <FaCheck />
              </button>
              <button
                onClick={() => onDelete(payment._id)}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
                title="Delete"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>
        <div className="mt-2">
          <h3 className="text-sm font-medium text-gray-700 mb-1">
            Persons involved:
          </h3>
          <div className="flex flex-wrap -mx-1">
            {payment.persons.map((personDetail) => (
              <div key={personDetail._id} className="px-1 mb-1">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs ${
                    payment.user === personDetail.person._id
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {personDetail.person.name}: ₹{personDetail.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;
