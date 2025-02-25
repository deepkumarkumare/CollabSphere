"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from 'next/navigation';

import technicalSkillsData from '../data/technicalSkills.json';
import interestData from '../data/interest.json';
import projectsData from '../data/projects.json';
import bannerImageData from '../data/bannerImage.json';
import profi from '../data/profileUrl.json';
import { buttonVariants } from "@/components/ui/button"
import Link from 'next/link';


const Swipeproj = () => {
  const router = useRouter();
  const [randomSkills, setRandomSkills] = useState<string[]>([]);
  const [randomInterests, setRandomInterests] = useState<string[]>([]);
  const [projectDesc, setProjectDesc] = useState<string>("");
  const [bannerImage, setBannerImage] = useState<string>(
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG2gendwSeTzW7uJwCNkjlsaYjQFA_MX2_fg&s'
  );
  const [profileImage, setProfileImage] = useState<string>(
    'https://pbs.twimg.com/media/FwbsBWVXoA4jAsb?format=jpg&name=4096x4096'
  );

  const getRandomItems = (array: string[], min: number, max: number): string[] => {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const setRandomValues = () => {
    const skills = getRandomItems(technicalSkillsData.technical_skills, 7, 15);
    setRandomSkills(skills);

    const interests = getRandomItems(interestData.interests, 7, 15);
    setRandomInterests(interests);

    const randomProject = projectsData.projects[
      Math.floor(Math.random() * projectsData.projects.length)
    ];
    setProjectDesc(randomProject.description);

    const randomBanner = bannerImageData.images[
      Math.floor(Math.random() * bannerImageData.images.length)
    ];
    setBannerImage(randomBanner);

    const randomProfile = profi.images[
      Math.floor(Math.random() * profi.images.length)
    ];
    setProfileImage(randomProfile);
  };

  useEffect(() => {
    setRandomValues();
  }, []);

  const handleSkip = () => {
    setRandomValues();
  };

  const handleGoToProject = () => {
    window.open(profileImage, '_blank');
  };

  return (
    <div>
      <Card>
        <div className="flex">
          <Card className="flex-1 m-2 p-5">
            <Card
              style={{
                backgroundImage: `url('${bannerImage}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
              className="h-32 mb-5"
            />
            <CardTitle className="mb-5 mx-5">Skills :</CardTitle>
            <div className="flex gap-3 flex-wrap mb-5 px-5">
              {randomSkills.length > 0 ? (
                randomSkills.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p>No skills selected yet.</p>
              )}
            </div>

            <CardTitle className="mb-5 mx-5">Interests :</CardTitle>
            <div className="flex gap-3 flex-wrap mb-20 px-5">
              {randomInterests.length > 0 ? (
                randomInterests.map((interest, index) => (
                  <Badge key={index} variant="outline">
                    {interest}
                  </Badge>
                ))
              ) : (
                <p>No interests selected yet.</p>
              )}
            </div>

            <div className="mt-5 px-5 pb-5">
              <CardTitle className="mb-5">Social Grid Community :</CardTitle>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => window.open('https://www.linkedin.com', '_blank')}
                >
                  LinkedIn
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open('https://github.com', '_blank')}
                >
                  GitHub
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open('https://mail.google.com', '_blank')}
                >
                  Gmail
                </Button>
              </div>
            </div>
          </Card>

          <Card className="flex-1 m-2 p-2 gap-3">
            <Card
              style={{
                backgroundImage: `url('${profileImage}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
              className="h-52 mb-2"
            />
            <Card>
              <CardTitle className="p-5">Project Description :</CardTitle>
              <div className="p-5 pt-0 text-sm">{projectDesc}</div>
              <Button
                className="mb-5 mx-5 w-[90%]"
                variant="outline"
                onClick={handleGoToProject}
              >
                Go to Project
              </Button>
            </Card>
          </Card>
        </div>
        <CardFooter className="gap-4 justify-between p-5">
          <div className="gap-4 flex">
            {/* <Button variant="outline">Contact</Button> */}
            <Link href={"/community"} className={buttonVariants({ variant: "outline" })}>Contact</Link>
            <Link href={"/search-profiles"} className={buttonVariants({ variant: "outline" })}>Join</Link>
            {/* <Button variant="outline">Join</Button> */}
          </div>
          <Button variant="outline" onClick={handleSkip}>
            Skip
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Swipeproj;