// TinyMCE.js
import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

const TinyMCE = ({ value, onChange }) => {
  return (
    <Editor
    apiKey='gywdsvp0cfz9cpcv5a3e8epcbgkcbznkyspinchoe419yidz'
      initialValue={value}
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
      onEditorChange={onChange}
    />
  );
};

export default TinyMCE;
