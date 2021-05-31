export const getPosts = async (req, res, next) => {
    res.status(200).json({});
};

export const createPost = async (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    res.status(201).json({
        message: 'Post created successfully!',
        post: { id: new Date().toISOString(), title: title, content: content }
    });
};
