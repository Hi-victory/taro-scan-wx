import { useState } from "react";
import { Modal } from "../components/Modal";

interface UseModalProps {}

export const useModal = (props?: UseModalProps) => {
  const [isShow, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  const showModal = (title: string, content: string) => {
    setShow(true);
    render(title, content);
  };

  const render = (title: string, content: string) => {
    if (!isShow) {
      return <></>;
    }
    return <Modal title={title} content={content} onClose={handleClose} />;
  };

  return showModal;
};
