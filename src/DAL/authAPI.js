import { invokeApi } from "../utils/invokeApi";
import { mockUsers, mockVerificationCodes, generateVerificationCode, simulateApiDelay } from "../mockData";


export const _login_api = async (data) => {
    // Mock implementation
    await simulateApiDelay(800);
    
    const user = mockUsers.find(u => u.email === data.email && u.password === data.password);
    
    if (user) {
        const { password, ...userWithoutPassword } = user;
        return {
            code: 200,
            message: "Login successful",
            token: "mock_token_" + Date.now(),
            admin: userWithoutPassword
        };
    } else {
        return {
            code: 401,
            message: "Invalid email or password"
        };
    }
    
    /*
    const requestObj = {
        path: `api/admin/login`,
        method: "POST",
        postData: data,
    };
    return invokeApi(requestObj);
    */
};

export const _logout_api = async (data) => {
    // Mock implementation
    await simulateApiDelay(500);
    return {
        code: 200,
        message: "Logged out successfully"
    };
    
    /*
    const requestObj = {
        path: `api/admin/logout`,
        method: "GET",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
        postData: data,
    };
    return invokeApi(requestObj);
    */
};

export const _change_password_api = async (data) => {
    // Mock implementation
    await simulateApiDelay(1000);
    
    // Simulate password change validation
    if (data.current_password === "password123") {
        return {
            code: 200,
            message: "Password changed successfully"
        };
    } else {
        return {
            code: 400,
            message: "Current password is incorrect"
        };
    }
    
    /*
    const requestObj = {
        path: `api/admin/change_password`,
        method: "PUT",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
        postData: data,
    };
    return invokeApi(requestObj);
    */
};

export const _update_admin_profile_api = async (data) => {
    // Mock implementation
    await simulateApiDelay(1000);
    
    return {
        code: 200,
        message: "Profile updated successfully",
        admin: {
            first_name: data.first_name,
            last_name: data.last_name,
            profile_image: data.profile_image
        }
    };
    
    /*
    const requestObj = {
        path: `api/admin/profile`,
        method: "PUT",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
        postData: data,
    };
    return invokeApi(requestObj);
    */
};

// New API functions for registration and forgot password
export const _register_api = async (data) => {
    await simulateApiDelay(1000);
    
    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === data.email);
    if (existingUser) {
        return {
            code: 400,
            message: "Email already exists"
        };
    }
    
    // Generate verification code
    const verificationCode = generateVerificationCode();
    mockVerificationCodes.set(data.email, {
        code: verificationCode,
        userData: data,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
        type: 'registration'
    });
    
    console.log(`Verification code for ${data.email}: ${verificationCode}`);
    
    return {
        code: 200,
        message: "Verification code sent to your email"
    };
};

export const _verify_registration_code_api = async (data) => {
    await simulateApiDelay(800);
    
    const storedData = mockVerificationCodes.get(data.email);
    
    if (!storedData) {
        return {
            code: 400,
            message: "No verification code found for this email"
        };
    }
    
    if (Date.now() > storedData.expiresAt) {
        mockVerificationCodes.delete(data.email);
        return {
            code: 400,
            message: "Verification code has expired"
        };
    }
    
    if (storedData.code !== data.code) {
        return {
            code: 400,
            message: "Invalid verification code"
        };
    }
    
    // Create new user
    const newUser = {
        _id: "user_" + Date.now(),
        ...storedData.userData,
        is_owner: false,
        status: true,
        profile_image: "",
    };
    
    mockUsers.push(newUser);
    mockVerificationCodes.delete(data.email);
    
    const { password, ...userWithoutPassword } = newUser;
    
    return {
        code: 200,
        message: "Registration successful",
        token: "mock_token_" + Date.now(),
        admin: userWithoutPassword
    };
};

export const _forgot_password_api = async (data) => {
    await simulateApiDelay(800);
    
    // Check if email exists
    const user = mockUsers.find(u => u.email === data.email);
    if (!user) {
        return {
            code: 400,
            message: "Email not found"
        };
    }
    
    // Generate verification code
    const verificationCode = generateVerificationCode();
    mockVerificationCodes.set(data.email, {
        code: verificationCode,
        email: data.email,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
        type: 'forgot_password'
    });
    
    console.log(`Password reset code for ${data.email}: ${verificationCode}`);
    
    return {
        code: 200,
        message: "Verification code sent to your email"
    };
};

export const _verify_forgot_password_code_api = async (data) => {
    await simulateApiDelay(800);
    
    const storedData = mockVerificationCodes.get(data.email);
    
    if (!storedData || storedData.type !== 'forgot_password') {
        return {
            code: 400,
            message: "No verification code found for this email"
        };
    }
    
    if (Date.now() > storedData.expiresAt) {
        mockVerificationCodes.delete(data.email);
        return {
            code: 400,
            message: "Verification code has expired"
        };
    }
    
    if (storedData.code !== data.code) {
        return {
            code: 400,
            message: "Invalid verification code"
        };
    }
    
    return {
        code: 200,
        message: "Verification code confirmed"
    };
};

export const _reset_password_api = async (data) => {
    await simulateApiDelay(1000);
    
    // Find user and update password
    const userIndex = mockUsers.findIndex(u => u.email === data.email);
    if (userIndex === -1) {
        return {
            code: 400,
            message: "User not found"
        };
    }
    
    mockUsers[userIndex].password = data.new_password;
    mockVerificationCodes.delete(data.email);
    
    return {
        code: 200,
        message: "Password reset successfully"
    };
};