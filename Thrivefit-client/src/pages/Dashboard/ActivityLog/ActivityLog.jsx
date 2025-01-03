
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { FaEye } from "react-icons/fa";
import useAuthProvider from "./../../../hooks/useAuthProvider";
import useTrainerData from "./../../../hooks/useTrainerData";
import useAxiosSecure from './../../../hooks/useAxiosSecure';
import { toast } from 'react-toastify';

const ActivityLog = () => {
  const { user } = useAuthProvider();
  const axiosSecure = useAxiosSecure()
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [trainer, isLoading, error, refetch] = useTrainerData({ email: user?.email });

  const handleViewFeedback = (trainer) => {
    setSelectedTrainer(trainer);
    setIsModalOpen(true);
  };
  const handleDeleteFeedback = (trainer) => {
    setIsDeleteModalOpen(true);
  };
  const deleteApplication = async(trainer) => {
    // console.log(trainer?.email);
    const {data} = await axiosSecure.delete(`/trainer/${trainer?.email}`);
    // console.log(data);
    if(data.deletedCount>0){
      toast.success("Delete Success!")
      refetch();
      setIsDeleteModalOpen(false);
    }
  }
  // console.log(error);
  // console.log(trainer.length);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Helmet>
          <title>ThriveFit | Loading Activity Log</title>
        </Helmet>
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Helmet>
          <title>ThriveFit | Error Loading Activity Log</title>
        </Helmet>
        <h1 className="text-2xl text-gray-800 capitalize">
          Error happened when geting data.
        </h1>
      </div>
    );
  }
  if (!trainer || trainer.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Helmet>
          <title>ThriveFit | Activity Log</title>
        </Helmet>
        <h1 className="text-2xl text-gray-800 capitalize">
          You are not applyed for trainer yet.
        </h1>
      </div>
    );
  }
  return (
    <div className="w-full mx-auto p-4">
      <Helmet>
        <title>ThriveFit | Activity Log</title>
      </Helmet>
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-900">
        My Activity Log
      </h1>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-gray-800 bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Status</th>
              {trainer?.status === "rejected" && (
                <>
                <th className="px-4 py-2">Actions</th>
                <th className="px-4 py-2">Delete</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-100">
              <td className="border px-4 py-2 text-center">
                {trainer.fullName}
              </td>
              <td className="border px-4 py-2 text-center">{trainer.email}</td>
              <td className={`border px-4 py-2 text-center `}>
                <span
                  className={`text-sm ${
                    (trainer?.status == "rejected" && "text-gray-700 bg-red-200") ||
                    (trainer?.status == "success" && "text-gray-700 bg-green-200") ||
                    (trainer?.status == "pending" && "text-gray-700 bg-yellow-200")
                  } p-1 py-0 rounded-lg`}
                >
                  {trainer?.status?.toUpperCase()}
                </span>
              </td>
              {trainer?.status === "rejected" && (
                <>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => handleViewFeedback(trainer)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <FaEye className="w-5 h-5" />
                  </button>
                </td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => handleDeleteFeedback(trainer)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </td>
                </>
                
              )}
            </tr>
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="bg-white p-6 rounded-lg z-10 max-w-md mx-auto">
            <h2 className="text-2xl mb-4 text-center">Rejection Feedback</h2>
            <p>{selectedTrainer?.feedbackMessage}</p>
            <button
              onClick={() =>  setIsModalOpen(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-center"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsDeleteModalOpen(false)}
          ></div>
          <div className="bg-white p-6 rounded-lg z-10 max-w-md mx-auto">
            <h2 className="text-2xl mb-4 text-center">Delete Applicatoin</h2>
            <p>Delete this application. If you don't then you unable to apply again.</p>
            <button
              onClick={() => deleteApplication(trainer)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-center"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
