import mongoose from 'mongoose';

import PostMessage from "../models/postMessage.js"; // important to add .js

export const getPosts = async (req, res) => {
  const { page } = req.query;
  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
    const total = await PostMessage.countDocuments({});

    const posts = await PostMessage.find().sort({ _id: -1}).limit(LIMIT).skip(startIndex);

    res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// QUERY -> /posts?page=1 -> page=1
// PARAMS -> /posts/123 -> id = 123

export const getPostsBySearch = async (req, res) => { 
  const { searchQuery, tags } = req.query;
  try {    
    const title = new RegExp(searchQuery, 'i'); // regular expression, ignore case eg. test and Test are same search terms

    const posts = await PostMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',') } }] });
    res.json({ data: posts });
    // find posts that match either of the 2 criteria,
    // 1. Is the title same as searched query in frontend ?
    // 2. Is one of the tags in array of tags equal to our searched tags ?
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPost = async (req, res) => { // async on whole fn if it has an await i.e having a asynchronous action
  const { id } = req.params;
  try {
    const post = await PostMessage.findById(id);

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;
  const newPostmessage = new PostMessage({ ...post, createdAt: new Date().toISOString() });
  try {
    await newPostmessage.save();

    res.status(201).json(newPostmessage);
  } catch(error) {
    res.status(409).json({message : error.message});
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, message, creator, selectedFile, tags } = req.body;

  if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

  const updatedPost = { creator, title, message, tags, selectedFile, _id: id };
  await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

  await PostMessage.findByIdAndRemove(id);

  res.json({ message: "Post deleted successfully." });
};

export const likePost = async (req, res) => {
  const { id } = req.params;
  
  if(!req.userId) return res.json({ message: `${req.userId}` });

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
  
  const post = await PostMessage.findById(id);

  const index = post.likes.findIndex((id) => id === String(req.userId));
  if(index === -1) {
    post.likes.push(req.userId);
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
  res.json(updatedPost);
};

export const commentPost = async (req, res) => {
  const { id } = req.params; // id is passed as parameter in the routes, see in api/index.js
  const { value } = req.body;

  const post = await PostMessage.findById(id);
  post.comments.push(value);

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
  res.json(updatedPost);
}
