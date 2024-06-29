import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/APIError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';


const registerUser = asyncHandler( async (req, res) => {
    // get user detail from frontend
    // validatation : not emply
    // check if user already exists : username and email
    // check for images, check for avatar
    // upload them to cloudinary
    // create user object - create entry in db
    // remove paassword and response token field from response
    // check for user creation
    // return res


    const {fullName, email, username, password} = res.body;
    console.log("Email: ", email);

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    )
    {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = User.findOne({
        $or: [{email}, {username}]
    })

    if(existedUser){
        throw new ApiError(409, "User already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    

    if(!avatar){
        throw new ApiError(400, "Avatar file is required");
    }


    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createduser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createduser){
        throw new ApiError(500, "Something went wrong while registering the user");
    
    }

    return res.status(201).json(
        new ApiResponse(200, createduser, "User registered successfully")
    )
})  


export { registerUser, } 