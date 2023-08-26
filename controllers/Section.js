const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }

    const newSection = await Section.create({ sectionName });

    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { courseContent: newSection._id },
      },
      { new: true }
    )
    .populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    })
    .exec()


    //todo use populate to replace sections subsections in the updated course deatils
    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourseDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went wrong while creating section  ",
    });
  }
};

//update section
exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId,courseId } = req.body;
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }

    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

     const course =await Course.findById(courseId).populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      }, 
     }).exec()

    return res.status(200).json({
      success: true,
      message: "Section Updated Successfully",
      data:course
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went wrong while updating section  ",
    });
  }
};

//delete section

exports.deleteSection = async (req, res) => {
  try {
    //get id -assuming we are sending id in params

    const { sectionId } = req.params;

    await Section.findByIdAndDelete(sectionId);

  //todo do we need to delete entry from schema


    return res.status(200).json({
      success: true,
      message: "Section deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went wrong while updating section  ",
    });
  }
};
