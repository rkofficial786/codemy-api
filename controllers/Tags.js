
const Category = require("../models/Category");

//create category

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All details required",
      });
    }

    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });

    return res.status(200).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//get all Category

exports.showAllCategory =async(req,res)=>{
    try {

        const allCategory =await Category.find({})
        res.status(200).json({
            success: true,
            message: "Category got successfully",
            allCategory
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
          });
    }
}