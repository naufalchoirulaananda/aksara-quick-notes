"use client";
import supabase from "@/utils/supabase";
import { useState, useEffect } from "react";
import { Note } from "@/types/note";
import React from "react";
import Modal from "react-modal";
import Image from "next/image";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import CSS

const Main = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editMessage, setEditMessage] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from("notenote")
      .select("*")
      .order("id", { ascending: false });
    if (error) console.log("Error fetching notes: ", error);
    else setNotes(data || []);
  };

  const addNote = async () => {
    const { data, error } = await supabase
      .from("notenote")
      .insert([{ title, message }]);
    if (error) console.log("Error adding note: ", error);
    else {
      setTitle("");
      setMessage("");
      fetchNotes();
    }
  };

  const deleteNote = async (id: number) => {
    const { data, error } = await supabase
      .from("notenote")
      .delete()
      .eq("id", id);
    if (error) console.log("Error deleting note: ", error);
    else fetchNotes();
  };

  const confirmDelete = (id: number) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this note?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteNote(id)
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };

  const updateNote = async () => {
    if (editNote) {
      const { data, error } = await supabase
        .from("notenote")
        .update({ title: editTitle, message: editMessage })
        .eq("id", editNote.id);
      if (error) console.log("Error updating note: ", error);
      else {
        setIsModalOpen(false);
        setEditNote(null);
        fetchNotes();
      }
    }
  };

  const openModal = (note: Note) => {
    setEditNote(note);
    setEditTitle(note.title);
    setEditMessage(note.message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditNote(null);
  };

  return (
    <>
      <div>
        <div className="pt-8 px-4 lg:px-32 mx-auto">
          <div className="mx-auto text-center mb-8 lg:mb-12">
          <div className="w-full h-auto rounded-xl mb-4">
                      <Image
                        className="h-[30px] w-full rounded-full object-cover"
                        src={
                          "https://res.cloudinary.com/dgnmqbglc/image/upload/v1718331103/Assets%20Components/bgblack_nhqjqn.png"
                        }
                        alt={"coming-soon"}
                        width={300}
                        height={200}
                        priority={true}
                        sizes="(max-width: 640px) 100vw,
            (max-width: 768px) 80vw,
            (max-width: 1024px) 60vw,
            50vw
            "
                      />
                    </div>
          </div>
        </div>

        <div className="mx-auto mb-8">
          <form
            className="lg:mx-32 mx-4"
            onSubmit={(e) => {
              e.preventDefault();
              addNote();
            }}
          >
            <div className="grid md:grid-cols-2 md:gap-6">
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Create a Title
                </label>
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  rows={1}
                  required
                />
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Take Notes
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="text-white bg-black font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Submit
            </button>
          </form>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mx-4 lg:mx-32 mb-8">
          {notes.map((note) => (
            <div className="border-gray-200 border-[1px] p-3 rounded-lg" key={note.id}>
              <div className="grid gap-6 lg:grid-cols-2">
                <p className="text-sm font-medium underline underline-offset-4">{note.title}</p>
              </div>
              <p className="mt-3 text-xs font-light text-gray-500 break-words line-clamp-1">{note.message}</p>
              <div className="flex gap-2 mt-6 items-end justify-between">
                <div>
                  <p className="text-[8px] text-gray-400">{note.created_at}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="text-[10px] text-black"
                    onClick={() => confirmDelete(note.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="text-[10px] text-black"
                    onClick={() => openModal(note)}
                  >
                    More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        contentLabel="Edit Note Modal"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] mx-4">
          <h2 className="text-2xl mb-4">Edit Note</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateNote();
            }}
          >
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="shadow appearance-none border rounded text-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Title"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Take Notes
              </label>
              <textarea
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
                className="shadow appearance-none border rounded text-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Message"
                rows={20}
                required
              ></textarea>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Save
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="bg-red-500 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default Main;
