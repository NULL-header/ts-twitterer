import React, { memo, ReactNode } from "react";
import {
  Modal as ModalOrigin,
  ModalOverlay,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@chakra-ui/react";
import { HeaddingCommon } from "frontend/components/ConfigBase";

export const Modal = memo<{
  children: ReactNode;
  header: string;
  onClose: () => void;
  isOpen: boolean;
}>(({ children, header, onClose, isOpen }) => (
  <ModalOrigin onClose={onClose} isOpen={isOpen}>
    <ModalOverlay />
    <ModalContent height="80vh" width="80vw" padding="5vh 5vw">
      <ModalCloseButton />
      <ModalHeader>
        <HeaddingCommon header={header} />
      </ModalHeader>
      <ModalBody>{children}</ModalBody>
    </ModalContent>
  </ModalOrigin>
));
Modal.displayName = "Modal";
