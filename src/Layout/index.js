import React from "react";
import Header from "./Header";
import NotFound from "./NotFound";
import { Routes, Route } from "react-router-dom";
import Home from "../Components/Home";
import CreateDeck from "../Components/CreateDeck";
import Deck from "../Components/Deck";
import EditDeck from "../Components/EditDeck";
import EditCard from "../Components/EditCard";
import AddCard from "../Components/AddCard";
import Study from "../Components/Study";

function Layout() {
  return (
    <>
      <Header />
      <div className="container">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="decks/new" element={<CreateDeck />} />
            <Route path="/decks/:deckId" element={<Deck />} />
            <Route path="/decks/:deckId/study" element={<Study />} />
            <Route path="/decks/:deckId/edit" element={<EditDeck />} />
            <Route path="/decks/:deckId/cards/new" element={<AddCard />} />
            <Route path="/decks/:deckId/cards/:cardId/edit" element={<EditCard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
      </div>
    </>
  );
}

export default Layout;
