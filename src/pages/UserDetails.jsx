import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getAllUsers } from "../features/usersSlice";
import { useNavigate, useParams } from "react-router-dom";

const UserDetails = () => {
  const { users } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const navigate = useNavigate();

  const user = users.find((user) => user.id === Number(id));

  const handleDelete = () => {
    dispatch(deleteUser(user.id));
    navigate("/");
  };

  return (
    <div className="m-4">
      {user ? (
        <div>
          <div className="flex gap-4">
            <button
              className="bg-green-500 px-3 py-1 rounded-sm text-white mb-4 hover:bg-green-800"
              onClick={() => navigate(`/edit-user/${user.id}`)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 px-3 py-1 rounded-sm text-white mb-4 hover:bg-red-800"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
          <table className="min-w-full border border-gray-400">
            <tbody>
              {user.id && (
                <tr className="border-b">
                  <td className="border border-gray-400 p-2 font-bold">ID</td>
                  <td className="border border-gray-400 p-2">{user.id}</td>
                </tr>
              )}
              {user.name && (
                <tr className="border-b">
                  <td className="border border-gray-400 p-2 font-bold">Name</td>
                  <td className="border border-gray-400 p-2">{user.name}</td>
                </tr>
              )}
              {user.username && (
                <tr className="border-b">
                  <td className="border border-gray-400 p-2 font-bold">
                    Username
                  </td>
                  <td className="border border-gray-400 p-2">
                    {user.username}
                  </td>
                </tr>
              )}
              {user.email && (
                <tr className="border-b">
                  <td className="border border-gray-400 p-2 font-bold">
                    Email
                  </td>
                  <td className="border border-gray-400 p-2">{user.email}</td>
                </tr>
              )}
              {user.phone && (
                <tr className="border-b">
                  <td className="border border-gray-400 p-2 font-bold">
                    Phone
                  </td>
                  <td className="border border-gray-400 p-2">{user.phone}</td>
                </tr>
              )}
              {user.website && (
                <tr className="border-b">
                  <td className="border border-gray-400 p-2 font-bold">
                    Website
                  </td>
                  <td className="border border-gray-400 p-2">{user.website}</td>
                </tr>
              )}
              <tr className="border-b">
                <td className="border border-gray-400 p-2 font-bold">
                  Address
                </td>
                <td className="border border-gray-400 p-2">
                  <div>
                    <div className="flex">
                      <div className="font-bold w-[8rem]">City</div>{" "}
                      <div>{user.address?.city}</div>
                    </div>
                    <div className="flex">
                      <div className="font-bold w-[8rem]">Steet</div>{" "}
                      <div>{user.address?.street}</div>
                    </div>

                    {user.address.suite && (
                      <div className="flex">
                        <div className="font-bold w-[8rem]">Suite</div>{" "}
                        <div>{user.address?.suite}</div>
                      </div>
                    )}
                    {user.address.zipcode && (
                      <div className="flex">
                        <div className="font-bold w-[8rem]">Zip Code</div>{" "}
                        <div>{user.address?.zipcode}</div>
                      </div>
                    )}
                    {user.address.geo.lat && user.address.lng && (
                      <div className="flex">
                        <div className="font-bold w-[8rem]">Geo</div>{" "}
                        <div>
                          Latitude: {user.address?.geo?.lat} Longitude:{" "}
                          {user.address?.geo?.lng}
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
              {(user.company.name ||
                user.company.catchphrase ||
                user.company.bs) && (
                <tr className="border-b">
                  <td className="border border-gray-400 p-2 font-bold">
                    Company Details
                  </td>
                  <td className="border border-gray-400 p-2">
                    {user?.company?.name && (
                      <div className="flex">
                        <div className="font-bold w-[8rem]">Name</div>{" "}
                        <div>{user.company?.name}</div>
                      </div>
                    )}
                    {user?.company?.catchPhrase && (
                      <div className="flex">
                        <div className="font-bold w-[8rem]">Catch Phrase</div>{" "}
                        <div>{user.company?.catchPhrase}</div>
                      </div>
                    )}
                    {user?.company?.bs && (
                      <div className="flex">
                        <div className="font-bold w-[8rem]">BS</div>{" "}
                        <div>{user.company?.bs}</div>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="font-bold text-xl">User not found!</p>
      )}
    </div>
  );
};

export default UserDetails;
