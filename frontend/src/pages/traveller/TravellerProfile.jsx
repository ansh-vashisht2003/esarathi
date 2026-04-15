import { useEffect, useState } from "react";
import TravellerNavbar from "../components/TravellerNavbar";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaLock, FaSignOutAlt } from "react-icons/fa";

const API_BASE = "http://localhost:5000";

const DEFAULT_AVATAR =
"https://ui-avatars.com/api/?name=Traveller&background=22c55e&color=fff&size=256";

const TravellerProfile = () => {

const navigate = useNavigate();
const traveller = JSON.parse(localStorage.getItem("traveller"));

const profilePicUrl = traveller?.profilePic
? `${API_BASE}/traveller_pic/${traveller.profilePic}`
: DEFAULT_AVATAR;

const [profilePic, setProfilePic] = useState(profilePicUrl);
const [previewPic, setPreviewPic] = useState(profilePicUrl);

const [soloRides, setSoloRides] = useState([]);
const [shareRides, setShareRides] = useState([]);

const [showPicModal, setShowPicModal] = useState(false);
const [showPasswordModal, setShowPasswordModal] = useState(false);
const [uploading, setUploading] = useState(false);

const [oldPassword, setOldPassword] = useState("");
const [newPassword, setNewPassword] = useState("");

useEffect(() => {
if (!traveller) navigate("/choose-role");
}, [traveller, navigate]);

/* LOAD RIDE HISTORY */

useEffect(() => {

if (!traveller?.email) return;

const loadHistory = async () => {

try {

const soloRes = await fetch(
`${API_BASE}/api/rides/traveller/${traveller.email}`
);

const soloData = await soloRes.json();
setSoloRides(soloData || []);

const shareRes = await fetch(
`${API_BASE}/api/share-rides/traveller/${traveller.email}`
);

const shareData = await shareRes.json();
setShareRides(shareData || []);

} catch (err) {

console.log(err);

}

};

loadHistory();

}, [traveller?.email]);

/* IMAGE PREVIEW */

const handlePreview = (e) => {

const file = e.target.files[0];
if (!file) return;

const reader = new FileReader();

reader.onload = () => {
setPreviewPic(reader.result);
};

reader.readAsDataURL(file);

};

/* UPLOAD PROFILE PIC */

const handleProfilePicChange = async (e) => {

const file = e.target.files[0];
if (!file) return;

setUploading(true);

const formData = new FormData();
formData.append("profilePic", file);

try {

const res = await fetch(
`${API_BASE}/api/traveller/profile-pic/${traveller.email}`,
{
method: "PUT",
body: formData,
}
);

const data = await res.json();
if (!res.ok) return alert(data.message || "Upload failed");

const updatedTraveller = {
...traveller,
profilePic: data.profilePic,
};

localStorage.setItem("traveller", JSON.stringify(updatedTraveller));

const newUrl = `${API_BASE}/traveller_pic/${data.profilePic}`;

setProfilePic(newUrl);
setPreviewPic(newUrl);

setShowPicModal(false);

} catch (err) {

console.error(err);
alert("Failed to upload image");

} finally {

setUploading(false);

}

};

/* CHANGE PASSWORD */

const handleChangePassword = async (e) => {

e.preventDefault();

try {

const res = await fetch(
`${API_BASE}/api/traveller/change-password/${traveller.email}`,
{
method: "PUT",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ oldPassword, newPassword }),
}
);

const data = await res.json();

if (!res.ok) return alert(data.message);

alert("Password updated successfully ✅");

setShowPasswordModal(false);
setOldPassword("");
setNewPassword("");

} catch (err) {

console.error(err);
alert("Error changing password");

}

};

/* UBER STYLE RIDE CARD */

const RideCard = ({ ride }) => {

const pickup =
ride.pickup?.address || ride.pickup?.city || "Unknown";

const drop =
ride.drop?.address || ride.drop?.city || "Unknown";

const price =
ride.fare || ride.price || ride.totalPrice || 0;

const status =
ride.status || "COMPLETED";

return (

<div className="bg-white shadow rounded-xl p-4 border hover:shadow-md transition">

<div className="flex justify-between items-center">

<div>

<p className="font-semibold text-green-700">
{pickup}
</p>

<p className="text-sm text-gray-500">
↓
</p>

<p className="font-semibold text-gray-700">
{drop}
</p>

</div>

<div className="text-right">

<p className="text-green-600 font-bold">
₹ {price}
</p>

<p className="text-xs text-gray-500">
{new Date(ride.createdAt).toLocaleDateString()}
</p>

<span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
{status}
</span>

</div>

</div>

</div>

);

};

return (

<div className="min-h-screen bg-green-50">

<TravellerNavbar travellerName={traveller?.name || "Traveller"} />

<div className="max-w-6xl mx-auto p-8">

{/* PROFILE HEADER */}

<div className="bg-white rounded-2xl shadow p-8 flex flex-col md:flex-row items-center gap-8">

<div className="relative">

<img
src={profilePic}
alt="Profile"
className="w-36 h-36 rounded-full object-cover border-4 border-green-500 shadow"
/>

<button
onClick={() => setShowPicModal(true)}
className="absolute bottom-2 right-2 bg-green-600 text-white p-2 rounded-full shadow hover:bg-green-700 transition"
>

<FaCamera />

</button>

</div>

<div className="text-center md:text-left">

<h2 className="text-3xl font-bold text-green-800">
{traveller?.name}
</h2>

<p className="text-gray-600">{traveller?.email}</p>

<p className="text-sm text-green-600 mt-1">
Role: Traveller
</p>

<div className="mt-4 flex flex-wrap gap-3">

<button
onClick={() => setShowPasswordModal(true)}
className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
>

<FaLock /> Change Password

</button>

<button
onClick={() => {
localStorage.removeItem("traveller");
navigate("/choose-role");
}}
className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
>

<FaSignOutAlt /> Logout

</button>

</div>

</div>

</div>

{/* RIDE HISTORY */}

<div className="mt-10 grid md:grid-cols-2 gap-8">

{/* SOLO RIDES */}

<div>

<h3 className="text-xl font-bold text-green-800 mb-4">
🚗 Solo Rides
</h3>

{soloRides.length === 0 ? (

<div className="bg-white rounded-xl shadow p-6 text-gray-600 text-center">
No solo rides yet
</div>

) : (

<div className="space-y-3">

{soloRides.map((ride) => (
<RideCard key={ride._id} ride={ride} />
))}

</div>

)}

</div>

{/* SHARE RIDES */}

<div>

<h3 className="text-xl font-bold text-green-800 mb-4">
👥 Ride Share
</h3>

{shareRides.length === 0 ? (

<div className="bg-white rounded-xl shadow p-6 text-gray-600 text-center">
No shared rides yet
</div>

) : (

<div className="space-y-3">

{shareRides.map((ride) => (
<RideCard key={ride._id} ride={ride} />
))}

</div>

)}

</div>

</div>

</div>

{/* PROFILE PIC MODAL */}

{showPicModal && (

<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

<div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

<h3 className="text-xl font-bold text-green-700 mb-4 text-center">
Update Profile Picture
</h3>

<div className="flex justify-center mb-4">

<img
src={previewPic}
alt="Preview"
className="w-28 h-28 rounded-full object-cover border-4 border-green-500 shadow"
/>

</div>

<input
type="file"
accept="image/*"
onChange={(e) => {
handlePreview(e);
handleProfilePicChange(e);
}}
/>

<div className="flex gap-3 mt-5">

<button
onClick={() => setShowPicModal(false)}
className="w-1/2 py-2 rounded-lg bg-gray-200"
>

Cancel

</button>

<button
disabled={uploading}
className="w-1/2 py-2 rounded-lg bg-green-600 text-white"
>

{uploading ? "Uploading..." : "Done"}

</button>

</div>

</div>

</div>

)}

{/* PASSWORD MODAL */}

{showPasswordModal && (

<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

<div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">

<h3 className="text-lg font-bold text-green-700 mb-4 text-center">
Change Password
</h3>

<form onSubmit={handleChangePassword} className="space-y-3">

<input
type="password"
placeholder="Current Password"
value={oldPassword}
onChange={(e) => setOldPassword(e.target.value)}
className="w-full px-3 py-2 border rounded-lg"
/>

<input
type="password"
placeholder="New Password"
value={newPassword}
onChange={(e) => setNewPassword(e.target.value)}
className="w-full px-3 py-2 border rounded-lg"
/>

<button
type="submit"
className="w-full py-2 bg-green-600 text-white rounded-lg"
>

Update Password

</button>

</form>

<button
onClick={() => setShowPasswordModal(false)}
className="w-full mt-3 py-2 bg-gray-200 rounded-lg"
>

Cancel

</button>

</div>

</div>

)}

</div>

);

};

export default TravellerProfile;