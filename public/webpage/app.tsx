import { TextDocument, TextDocumentChange, Folder } from "../../docs";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import Editor from "../../components/editor/Editor";
import './index.css';


class WebPage extends React.Component<TextDocument> {
  private static _folder = new Folder();

  constructor(props) {
    super(props);
    this.state = { documents: new Folder(), current_document: null };
  }

  static get folder() {
    return this._folder;
  }

  static updateFolder() {
    // called by chrome.sync
  }

  render() {
    if (this.state["current_document"] === null)
      return <FileMenu />;
    else
      return <Editor doc={this.state["current_document"]} />;
  }
}

chrome.runtime.onInstalled.addListener(() => {
  WebPage
});

ReactDOM.render(
  <React.StrictMode>
    <WebPage />
  </React.StrictMode>,
  document.getElementById("root")
);


