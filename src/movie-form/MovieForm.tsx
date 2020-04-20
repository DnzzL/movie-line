import { ClearOutlined, SearchOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { AutoComplete, Button, Form, Input, Select } from 'antd';
import * as imdb from 'imdb-api';
import debounce from 'lodash.debounce';
import React, { useState } from 'react';
import { fetchMovieTitles } from '../service/api';
const languages = require('country-data').languages;

type Language = {
  name: string;
  alpha2: string;
  alpha3: string;
  bibliographic: string;
};

type Props = {
  imdbId: string;
  onFinishHandle: Function;
  onFinishFailedHandle: Function;
};

export const MovieForm = ({
  imdbId,
  onFinishHandle,
  onFinishFailedHandle,
}: Props) => {
  const [results, setResults] = useState<imdb.SearchResults>();
  const [options, setOptions] = useState<{ value: string }[]>([]);
  const [movieTitle, setMovieTitle] = useState('');
  const [movieLanguage, setMovieLanguage] = useState('');
  const [movieReplica, setMovieReplica] = useState('');

  const { Option } = Select;
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const onSearch = async (searchText: string) => {
    const queryResults = await fetchMovieTitles(searchText);
    setResults(queryResults);

    const options = [];
    const titles = queryResults.results.map((e: any) => e.title);
    for (var val of titles) {
      options.push({ value: val });
    }
    setOptions(!searchText ? [] : options);
  };

  const onTitleSelect = async (data: string) => {
    setMovieTitle(data);
    if (results && results.results) {
      imdbId = results.results.find((e) => e.title === data)!.imdbid;
      form.setFieldsValue({
        imdbId,
      });
    }
  };

  return (
    <Form
      form={form}
      name='movie-form'
      onFinish={(values) => onFinishHandle(values)}
      onFinishFailed={(errorInfo) => onFinishFailedHandle(errorInfo)}
    >
      <Form.Item>
        <AutoComplete
          options={options}
          onSelect={onTitleSelect}
          onSearch={debounce(onSearch, 500)}
          placeholder='Select a movie title'
        />
      </Form.Item>

      <EmptyShell>
        <Form.Item label='imdbId' name='imdbId'>
          <TextArea rows={1} />
        </Form.Item>
      </EmptyShell>

      <Form.Item label='Language' name='language'>
        <Select
          showSearch
          placeholder='Select a language'
          optionFilterProp='children'
          onSelect={(value: string, option) => setMovieLanguage(value)}
          filterOption={(input, option) =>
            option != null &&
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {languages.all.map((l: Language) => (
            <Option value={l.name}>{l.name}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label='Replica'
        name='replica'
        rules={[{ required: true, message: 'Please input the movie replica' }]}
      >
        <TextArea rows={3} onChange={(e) => setMovieReplica(e.target.value)} />
      </Form.Item>

      <Form.Item>
        <SubmitButtonWrapper>
          <Button
            htmlType='button'
            icon={<ClearOutlined />}
            onClick={() => form.resetFields()}
          >
            Reset
          </Button>
          <Button type='primary' htmlType='submit' icon={<SearchOutlined />}>
            Submit
          </Button>
        </SubmitButtonWrapper>
      </Form.Item>
    </Form>
  );
};

const SubmitButtonWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const EmptyShell = styled.div`
  display: none;
`;
