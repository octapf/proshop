import mongoose from 'mongoose'

const reviewSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		rating: {
			type: Number,
			required: true,
		},
		comment: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
)

const Review = mongoose.model('Review', reviewSchema)

export default Review
