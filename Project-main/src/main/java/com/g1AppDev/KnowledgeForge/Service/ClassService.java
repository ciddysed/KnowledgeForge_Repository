package com.g1AppDev.KnowledgeForge.Service;



import com.g1AppDev.KnowledgeForge.Entity.Class;
import com.g1AppDev.KnowledgeForge.Repository.ClassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClassService {

    @Autowired
    private ClassRepository classRepository;

    public List<Class> getAllClasses() {
        return classRepository.findAll();
    }

    public Optional<Class> getClassById(int classID) {
        return classRepository.findById(classID);
    }

    public Class saveClass(Class newClass) {
        return classRepository.save(newClass);
    }

    public void deleteClass(int classID) {
        classRepository.deleteById(classID);
    }

    public List<Class> getClassesByTutor(int tutorId) {
        return classRepository.findByTutorTutorID(tutorId);
    }
}

