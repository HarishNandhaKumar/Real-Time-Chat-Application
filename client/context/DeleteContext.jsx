import { createContext, useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const DeleteContext = createContext();

export const DeleteProvider = ({ children }) => {
  const { logout, token } = useContext(AuthContext);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const navigate = useNavigate();

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
  try {
    console.log("Token being sent for DELETE:", token);

    const res = await axios.delete("/api/auth/delete", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.data.success) {
      toast.success("Account deleted");
      logout(); // logs user out and clears localStorage
      navigate("/");
    } else {
      toast.error(res.data.message || "Failed to delete account");
    }
  } catch (err) {
    console.error("Delete error:", err);

    // Check if server responded with error message
    const errorMessage =
      err.response?.data?.message || err.message || "Failed to delete account";

    toast.error(errorMessage);
    } finally {
        setShowConfirmDelete(false);
    }
    };


  return (
    <DeleteContext.Provider
      value={{
        showConfirmDelete,
        setShowConfirmDelete,
        handleDeleteClick,
        confirmDelete,
      }}
    >
      {children}
    </DeleteContext.Provider>
  );
};

export const useDelete = () => useContext(DeleteContext);

