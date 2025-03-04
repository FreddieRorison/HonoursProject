import { cookies } from 'next/headers';

export default async function notificationHistoryTile({Id}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const cookieStore = await cookies();
  const cookie = cookieStore.get("jwt")?.value

  const trClass = "border-t border-gray-300 ";
  const colourMap = {
    1: trClass + "bg-green-400",
    2: trClass + "bg-yellow-400",
    3: trClass + "bg-red-400"
  }

  const getNotifications = async () => {
        const response = await fetch(apiUrl + '/getPlantNotifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({jwt: cookie, plantId: Id})
        })
          return await response.json();
    }

    const notif = await getNotifications();
    const notifications = notif.notifications;

    return (
      <div className="bg-white shadow-md p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Notification History</h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-lg">
              <thead className="bg-green-900 text-white">
                <tr>
                  <th className="text-left p-3">Date & Time</th>
                  <th className="text-left p-3">Recommendation</th>
                  <th className="text-left p-3">Resolved?</th>
                </tr>
              </thead>
              <tbody>
              {
              notifications ? 
              notifications.map((row) => {
                let notification = row;
                if (notification.Resolved) {
                  notification.SeverityId = 1;
                }

                let date = new Date(notification.Date.replace(" ", "T"))

                return (
                <tr key={notification.Id} className={`${colourMap[notification.SeverityId] || "bg-gray-500"}`}>
                <td className="p-3 text-gray-800">{date.toUTCString()}</td>
                <td className="p-3 text-gray-800">{notification.Resolved ? <s> {notification.Name} </s>: notification.Name}</td>
                <td className="p-3 text-gray-800">{notification.Resolved ? "True" : "False"}</td>
                </tr>
                )}) :
                <tr></tr>
                }
              </tbody>
            </table>
          </div>
        </div>
    );
}