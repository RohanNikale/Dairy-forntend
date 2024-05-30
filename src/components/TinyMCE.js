import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import './TinyMCE.css'
export default function App() {
  return (

          <div>
            <Editor
              apiKey='gywdsvp0cfz9cpcv5a3e8epcbgkcbznkyspinchoe419yidz'
              init={{
                height: '400',
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown',
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                tinycomments_mode: 'embedded',
                tinycomments_author: 'Author name',
                mergetags_list: [
                  { value: 'First.Name', title: 'First Name' },
                  { value: 'Email', title: 'Email' },
                ],
                ai_request: (request, respondWith) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
              }}
              

              className="post-textarea"
              initialValue="Welcome to TinyMCE!"
              
            />
      <button type="button" className="btn btn-primary post-button">Post</button>
          </div>
  );
}