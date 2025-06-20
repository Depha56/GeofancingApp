import { View, Text, Image, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert } from "react-native";
import { FontAwesome6, FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "expo-router";
import { useAuth } from "@/firebase/auth-context";
import { homeOptions } from "@/components/common/home-nav-options";

const Profile = () => {
    const navigation = useNavigation();
    const [menuVisible, setMenuVisible] = useState(false);
    const { user, updateUser } = useAuth(); 

    // Modal state for editing profile
    const [editModal, setEditModal] = useState(false);
    const [editName, setEditName] = useState(user?.fullName || "");
    const [editPhone, setEditPhone] = useState(user?.phoneNumber || "");
    const [editEmail, setEditEmail] = useState(user?.email || "");
    const [editAddress, setEditAddress] = useState(user?.address || "");
    const [saving, setSaving] = useState(false);

    // State for profile image
    const [profileImage, setProfileImage] = useState(user?.photoURL || "https://randomuser.me/api/portraits/men/75.jpg");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        navigation.setOptions(homeOptions(user, setMenuVisible, menuVisible));
    }, [navigation, menuVisible, user]);

    // Cloudinary image upload function
    const uploadProfileImageToCloudinary = async (uri: string): Promise<string> => {
        const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_NAME;
        const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_PRESET;

        if (!cloudName || !uploadPreset) {
            console.error('Missing Cloudinary configuration');
            throw new Error('Cloudinary configuration is missing');
        }

        const formData = new FormData();
        // Cloudinary expects the file field to be named "file"
        formData.append('file', {
            uri,
            type: 'image/jpeg',
            name: 'profile.jpg',
        } as any);
        formData.append('upload_preset', uploadPreset);
        formData.append('folder', 'profile_pictures');

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
            {
                method: 'POST',
                body: formData,
                headers: {
                    Accept: 'application/json',
                },
            }
        );
        const data = await response.json();
        if (!data.secure_url) {
            throw new Error('Failed to upload image');
        }
        return data.secure_url;
    };

    // Handle image pick
    const handlePickImage = async () => {
        setUploading(true);
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });
        if (!result.canceled && result.assets && result.assets[0].uri) {
            try {
                const url = await uploadProfileImageToCloudinary(result.assets[0].uri);
                setProfileImage(url);
                // Update user photoURL in Firestore
                await updateUser({ photoURL: url });
                Alert.alert("Profile Image", "Image uploaded!");
            } catch (e: any) {
                Alert.alert("Upload Error", e.message || "Failed to upload image");
            }
        }
        setUploading(false);
    };

    // Handle profile save
    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            await updateUser({
                fullName: editName,
                phoneNumber: editPhone,
                email: editEmail,
                address: editAddress,
            });
            setEditModal(false);
            Alert.alert("Profile", "Profile updated!");
        } catch (e) {
            Alert.alert("Error", "Failed to update profile");
        }
        setSaving(false);
    };

    if (!user) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-100">
                <ActivityIndicator size="large" color="#2563EB" />
                <Text className="mt-4 text-gray-500">Loading profile...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-100">
            <View className="flex-1 items-center justify-center px-6">
                <View className="bg-white w-full rounded-3xl shadow-xl p-6 items-center relative">
                    {/* Edit Profile Modal */}
                    <Modal
                        visible={editModal}
                        transparent
                        animationType="slide"
                        onRequestClose={() => setEditModal(false)}
                    >
                        <View className="flex-1 justify-center items-center bg-black/40">
                            <View className="bg-white rounded-xl p-6 w-11/12 max-w-md">
                                <Text className="text-lg font-semibold mb-4">Edit Profile</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg px-4 py-3 mb-3"
                                    placeholder="Full Name"
                                    value={editName}
                                    onChangeText={setEditName}
                                />
                                <TextInput
                                    className="border border-gray-300 rounded-lg px-4 py-3 mb-3"
                                    placeholder="Phone"
                                    value={editPhone}
                                    onChangeText={setEditPhone}
                                    keyboardType="phone-pad"
                                />
                                <TextInput
                                    className="border border-gray-300 rounded-lg px-4 py-3 mb-3"
                                    placeholder="Email"
                                    value={editEmail}
                                    onChangeText={setEditEmail}
                                    keyboardType="email-address"
                                />
                                <TextInput
                                    className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                                    placeholder="Address"
                                    value={editAddress}
                                    onChangeText={setEditAddress}
                                />
                                <View className="flex-row justify-end gap-x-2">
                                    <TouchableOpacity
                                        className="px-4 py-2 rounded-lg bg-gray-200"
                                        onPress={() => setEditModal(false)}
                                        disabled={saving}
                                    >
                                        <Text className="text-gray-700 font-semibold">Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        className="px-4 py-2 rounded-lg bg-blue-600"
                                        onPress={handleSaveProfile}
                                        disabled={saving}
                                    >
                                        <Text className="text-white font-semibold">
                                            {saving ? 'Saving...' : 'Save'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    {/* Edit Profile Icon */}
                    <TouchableOpacity
                        className="absolute top-4 right-4 p-2 rounded-full bg-blue-100"
                        accessibilityLabel="Edit Profile"
                        onPress={() => {
                            setEditName(user.fullName || "");
                            setEditPhone(user.phoneNumber || "");
                            setEditEmail(user.email || "");
                            setEditAddress(user.address || "");
                            setEditModal(true);
                        }}
                    >
                        <FontAwesome6 name="edit" size={20} color="#2563EB" />
                    </TouchableOpacity>

                    {/* Profile Image with Edit Icon */}
                    <View className="mb-4">
                        <Image
                            source={{ uri: profileImage }}
                            className="w-32 h-32 rounded-full border-4 border-blue-500"
                        />
                        <TouchableOpacity
                            className="absolute bottom-2 right-2 bg-white p-2 rounded-full border border-gray-300"
                            style={{ position: 'absolute', bottom: 0, right: 0 }}
                            onPress={handlePickImage}
                            accessibilityLabel="Change Profile Image"
                        >
                            {uploading ? (
                                <ActivityIndicator size={18} color="#2563EB" />
                            ) : (
                                <FontAwesome name="camera" size={18} color="#2563EB" />
                            )}
                        </TouchableOpacity>
                    </View>

                    <Text className="text-2xl font-bold text-gray-800 mb-1">{user.fullName || "No Name"}</Text>
                    <Text className="text-sm text-gray-500 mb-4">{user.farmId ? `Farm ID: ${user.farmId}` : ""}</Text>
                    <View className="w-full px-4">
                        <View className="mb-2">
                            <Text className="text-gray-500 text-sm">Phone</Text>
                            <Text className="text-gray-800 font-medium">{user.phoneNumber || "-"}</Text>
                        </View>
                        <View className="mb-2">
                            <Text className="text-gray-500 text-sm">Email</Text>
                            <Text className="text-gray-800 font-medium">{user.email}</Text>
                        </View>
                        <View className="mb-2">
                            <Text className="text-gray-500 text-sm">Created At</Text>
                            <Text className="text-gray-800 font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}</Text>
                        </View>
                        <View>
                            <Text className="text-gray-500 text-sm">Address</Text>
                            <Text className="text-gray-800 font-medium">{user.address || "-"}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default Profile;
