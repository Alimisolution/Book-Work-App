import cloudinary from '../lib/cloudinary.js'
import Book from '../models/bookModel.js';

const createBook = async(req,res) =>{
     const {title, caption, rating, image} = req.body;

    try {
        if(!title || !caption || !rating || !image){
            return res.status(400).json({message: 'All field are required'})
        }
    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;

    const newBook = await Book.create({
        title,
        caption,
        rating,
        image: imageUrl,
        user: req.user._id
    })

    res.status(201).json({
        book: newBook
    })
    } catch (error) {
        console.log('Error createing book', error)
       res.status(500).json({message: 'Internal server error'});
    }
}

const getAllBooks = async(req,res) =>{

    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;

        const books = await Book.find().sort({createdAt: -1}).skip(skip).limit(limit).populate('user', 'username profileImage');
        
        const totalBooks = await Book.countDocuments();

        res.status(200).json({

            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit)
        })
        
    } catch (error) {
         console.log('Error retrieving books', error)
       res.status(500).json({message: 'Internal server error'});
    }

}

const deleteBook = async(req,res) =>{
    try {
        const book = await Book.findById(req.params.id);
        if(!book) return res.status(404).json({message: 'Book not found'});

        //check if book belongs to user
        if(book.user.toString() !== req.user._id.toString()){
            return res.status(401).json({message: 'Unauthorized'});
        }

        // delete image from cloudinary
        if(book.image && book.image.includes('cloudinary')){
            try {
                const publicId = book.image.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId)
            } catch (error) {
                console.log('Error deleting image from clodinary');
            }
        }

        await book.deleteOne();
        res.json({message: 'Book deleted successfully'});

    } catch (error) {
        console.log('Error deleting books', error)
       res.status(500).json({message: 'Internal server error'});
    }
}

const getUserBooks = async(req,res) =>{
    try {
        const books = await Book.find({user: req.user._id}).sort({createdAt: -1})
        res.status(200).json({books})
    } catch (error) {
       res.status(500).json({message: 'Internal server error'});
    }
}


export {createBook, getAllBooks, getUserBooks, deleteBook};