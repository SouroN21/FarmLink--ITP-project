import React from "react";
import UpdateProfile from "../../commenCompo/UpdateProfile";

const UpdateDelivery = () => {
  const userId = localStorage.getItem("userId");

  console.log(userId)

    return (
        <div>
            <UpdateProfile userId={userId} />
        </div>
    );
};

export default UpdateDelivery;