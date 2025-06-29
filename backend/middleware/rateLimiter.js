import ratelimit from "../config/upstash.js";

const rateLimiter = async(req,res, next) => {
    try {
        // here we just keep simple
        // in a real-world-app put user_id or IP address as the key
        const {success} = await ratelimit.limit("vaulet-rate-limit")

        if (!success){
            return res.status(429).json({
                message: "Too many requests, please try again later.",
            });
        }
        next();
    } catch (error) {
        console.log("Rate limit error",error)
        next(error)
    }
};

export default rateLimiter;