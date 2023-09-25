// OCRComponent.styles.ts
import styled from '@emotion/styled';

export const DropzoneContainer = styled.button`
  border: 2px dashed gray;
  margin: 10px;
  padding: 20px;
  text-align: center;
  width: 50%;
  color: #ebebeb;
  font-size: 1rem;
  background: transparent;
`;

export const PreviewImageContainer = styled.div`
  position: relative;
`;

export const DeleteButton = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ff0000;
  color: #ffffff;
  font-size: 16px;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  text-align: center;
  cursor: pointer;
  opacity: 0.35;
`;

export const ImagePreview = styled.img`
  width: 200px;
  height: auto;
  border: solid 1px #AAA;
`;

export const CheckboxContainer = styled.div`
  label {
    margin-right: 15px;
  }
`;

export const OptionsContainer = styled.div`
  label {
    margin-right: 15px;
  }
`;
