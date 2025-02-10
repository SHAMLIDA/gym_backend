const Membership = require('../Modals/memebership')  // ✅ Correct Import

exports.addMembership = async (req, res) => {
    try {
        const { months, price, gym } = req.body; 

        if (!req.gym && !gym) {
            return res.status(400).json({ error: "Gym ID is required" });
        }

        const gymId = req.gym?._id || gym;

        // ✅ Ensure `Membership` is properly referenced
        const existingMembership = await Membership.findOne({ gym: gymId, months });

        if (existingMembership) {
            existingMembership.price = price;
            await existingMembership.save();
            return res.json({ message: 'Membership updated successfully', membership: existingMembership });
        } else {
            const newMembership = new Membership({ gym: gymId, months, price });
            await newMembership.save();
            return res.json({ message: 'Membership created successfully', membership: newMembership });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    } 
};

exports.getmemebership = async (req, res) => {
    try {
        console.log("🔍 Checking req.gym:", req.gym);

        // Ensure req.gym exists
        if (!req.gym) {
            return res.status(401).json({ error: "Gym information is missing" });
        }

        const loggedinid = req.gym._id;
        console.log("✅ Gym ID:", loggedinid);

        const memberships = await Membership.find({ gym: loggedinid });

        res.status(200).json({
            message: "Gym memberships retrieved successfully",
            memberships
        });

    } catch (error) {
        console.error("❌ Error getting gym memberships:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

