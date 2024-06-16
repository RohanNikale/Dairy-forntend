import React, { useContext, useState } from 'react';
import './PostForm.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../MyContext';
import { Editor } from '@tinymce/tinymce-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PostForm() {
  const { backend_url } = useContext(MyContext);
  const navigate = useNavigate();
  const authToken = Cookies.get('authToken');

  const [formData, setFormData] = useState({
    title: '',
    type: 'Shayari', // default value
    content: '',
    tags: []
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleEditorChange = (content) => {
    setFormData({
      ...formData,
      content,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authToken) {
      navigate('/SignupLogin');
      return;
    }

    setLoading(true);
    toast.info('Posting...', { autoClose: false });

    const dataToSend = {
      ...formData,
      type: formData.type.toLowerCase() // convert type to lowercase
    };

    try {
      await axios.post(
        `${backend_url}/api/post/create`,
        dataToSend,
        {
          headers: {
            token: authToken,
          },
        }
      );

      setFormData({
        title: '',
        type: 'Shayari',
        content: '',
        tags: []
      });

      toast.dismiss();
      toast.success('Post created successfully');
      navigate('/'); // Navigate to home page
    } catch (error) {
      console.error('Error creating post:', error);
      toast.dismiss();
      toast.error('Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-form">
      <ToastContainer />
      <div className="container">
        <div className="full-screen">
          <div className="content">
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <>
                <h2 className="text-center mb-4">Create a New Post</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter your title here"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="type">Type</label>
                    <select className="form-control" id="type" value={formData.type} onChange={handleChange}>
                      <option value="shayari">Shayari</option>
                      <option value="gazal">Gazal</option>
                      <option value="nazm">Nazm</option>
                      <option value="geet">Geet</option>
                    </select>
                  </div>
                  <Editor
                    apiKey='gywdsvp0cfz9cpcv5a3e8epcbgkcbznkyspinchoe419yidz'
                    initialValue=""
                    init={{
                      height: 300,
                      menubar: false,
                      plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                      ],
                      toolbar:
                        'undo redo | formatselect | bold italic backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | help'
                    }}
                    onEditorChange={handleEditorChange}
                  />
                  <div className="form-group">
                    <label htmlFor="tags">Tags</label>
                    <input
                      type="text"
                      className="form-control"
                      id="tags"
                      value={formData.tags.join(',')}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',') })}
                      placeholder="Enter tags separated by commas"
                    />
                  </div>
                  <div className="text-center mt-4">
                    <button type="submit" className="follow-button followed">Post</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
