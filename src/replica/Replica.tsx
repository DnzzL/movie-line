import styled from '@emotion/styled';
import { Comment, List } from 'antd';
import React, { useState } from 'react';

export type Subtitle = {
  id: string;
  startTime: string;
  endTime: string;
  text: string;
};

type Props = {
  data: Subtitle[];
};

export const Replica = ({ data }: Props) => {
  const [author, setAuthor] = useState('A');
  return (
    <Root>
      <List
        className='comment-list'
        itemLayout='horizontal'
        size='small'
        dataSource={data}
        renderItem={item => (
          <Comment
            author={() => {
              setAuthor(author === 'A' ? 'B' : 'A');
              return author;
            }}
            content={item?.text}
            datetime={`${item?.startTime.split(',')[0]} - ${
              item?.endTime.split(',')[0]
            }`}
          />
        )}
      />
    </Root>
  );
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
