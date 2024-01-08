import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TodoListApp = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Load tasks from AsyncStorage on component mount
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const addTask = () => {
    if (task.trim() !== '') {
      setTasks([...tasks, { id: Date.now(), text: task }]);
      setTask('');
    }
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((item) => item.id !== taskId);
    setTasks(updatedTasks);
  };

  useEffect(() => {
    // Save tasks to AsyncStorage whenever tasks state changes
    saveTasks();
  }, [tasks]);

  return (
    <View>
      <Text>Todo List App</Text>
      <TextInput
        placeholder="Add Task"
        value={task}
        onChangeText={(text) => setTask(text)}
      />
      <Button title="Add" onPress={addTask} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.text}</Text>
            <Button title="Delete" onPress={() => deleteTask(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

export default TodoListApp;
