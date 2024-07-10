module.exports = mongoose => {
  const { Schema } = mongoose;

  const tutorialSchema = new Schema(
    {
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      published: {
        type: Boolean,
        default: false
      }
    },
    { timestamps: true }
  );

  tutorialSchema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Tutorial = mongoose.model("Tutorial", tutorialSchema);
  return Tutorial;
};