import { TextDocument, TextDocumentChange } from "../../docs";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import Editor from "../../components/editor/Editor";
import './index.css';

function 

class WebPage extends React.Component {
  constructor(props) {
    super(props);
    let doc = TextDocument.getDocumentByID(document.cookie.);
    this.setState({ current_document: doc })
  }
}

ReactDOM.render(
  <React.StrictMode>
    <WebPage />
  </React.StrictMode>,
  document.getElementById("root")
);

