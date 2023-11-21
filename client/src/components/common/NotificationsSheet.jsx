import React, { useContext, useEffect } from "react";
import Notification from "./Notification";
import { useQuery, useQueryClient } from "react-query";

import { ClipLoader } from "react-spinners";
import { BsInbox } from "react-icons/bs";
import { api } from "../../api";
import { userContext } from "../../contexts/UserContext";

const NotificationsSheet = () => {
  const queryClient = useQueryClient();
  const { user } = useContext(userContext);
  const { data: notifications, isLoading: notificationsLoading } = useQuery(
    ["notifications", user?.userId],
    async () => {
      const { data } = await api.get(`/api/profile/notification/${user.userId}`);
      return data;
    },
    { enabled: !!user, staleTime: 20000 }
  );

  useEffect(() => {
    api.patch(`/api/profile/notification/markAsRead/${user.userId}`).then(() => {
      queryClient.invalidateQueries(["notifications", user?.userId]);
    });
  });

  return notificationsLoading ? (
    <div className="w-full h-full flex items-center justify-center px-3">
      <ClipLoader color="white" />
    </div>
  ) : (
    <div className="mt-5 h-full overflow-y-auto px-3">
      {notifications &&
        notifications.map(
          (
            {
              category,
              content,
              roomId,
              createdAt,
              notificationId,
              isRead,
            },
            idx,
          ) => (
            <Notification
              key={idx}
              category={category}
              content={content}
              createdAt={createdAt}
              roomId={roomId}
              notificationId={notificationId}
              isRead={isRead}
            />
          )
        )}
      {!notificationsLoading && notifications.length == 0 && (
        <div className="w-full h-1/3 flex flex-col items-center justify-center">
          <BsInbox size={50} />
          <div>Your inbox is empty</div>
        </div>
      )}
    </div>
  );
};

export default NotificationsSheet;
