import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getAllUsers } from "../features/usersSlice";
import { useNavigate } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import Loader from "../components/Loader";

const Home = () => {
  const { users, loading, error } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const navigate = useNavigate();
  const goToPage = (page, id) => {
    navigate(`/${page}/${id}`);
  };

  const handleDelete = (id) => {
    dispatch(deleteUser(id));
  };

  const filterdUsers = () => {
    return users.filter((user) =>
      user.username?.toLowerCase().includes(search.toLowerCase())
    );
  };

  if (loading.get || loading.delete || loading.create || loading.update) {
    return <Loader />;
  }

  if (error) {
    alert(error);
    return (
      <div className="m-4 text-xl text-red-500 flex justify-center">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="sm:m-2 md:m-4">
      <div className="flex justify-end m-4">
        <input
          type="text"
          placeholder="Search Username"
          className="border-2 border-blue-400 rounded-md py-1 px-2 w-full max-w-xs"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {filterdUsers().length !== 0 ? (
        <table className="min-w-full border border-gray-400 text-sm md:text-base">
          <thead>
            <tr className="bg-[#243642] text-white">
              <th className="border border-gray-400 p-1">Sno.</th>
              <th className="border border-gray-400 p-1">Name</th>
              <th className="border border-gray-400 p-1">Username</th>
              <th className="border border-gray-400 p-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {filterdUsers().map((user, idx) => (
              <tr
                key={user.id}
                className="border-b cursor-pointer hover:bg-gray-400 odd:bg-gray-100 even:bg-white"
              >
                <td
                  className="border border-gray-400 p-1 text-center"
                  onClick={() => goToPage("user", user.id)}
                >
                  {idx + 1}
                </td>
                <td
                  className="border border-gray-400 p-1 text-center"
                  onClick={() => goToPage("user", user.id)}
                >
                  {user.name}
                </td>
                <td
                  className="border border-gray-400 p-1 text-center"
                  onClick={() => goToPage("user", user.id)}
                >
                  {user.username}
                </td>
                <td className="border border-gray-400 p-1">
                  <div className="flex justify-center items-center gap-2">
                    <button onClick={() => goToPage("edit-user", user.id)}>
                      <MdEdit className="w-5 h-5 text-green-500 hover:text-green-800" />
                    </button>
                    <button onClick={() => handleDelete(user?.id)}>
                      <MdDelete className="w-5 h-5 text-red-500 hover:text-red-800" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-xl flex justify-center mt-4 font-bold">No Users!</p>
      )}
    </div>
  );
};

export default Home;
