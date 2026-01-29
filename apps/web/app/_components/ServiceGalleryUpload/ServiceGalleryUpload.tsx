import React from 'react';

type Props = {
  id: string;
};

export default function ServiceGalleryUpload(props: Props) {
  const { id } = props;
  return <div id={id}>{<div>ServiceGalleryUpload {id}</div>}</div>;
}
