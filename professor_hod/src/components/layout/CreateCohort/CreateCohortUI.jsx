import React, { useState } from "react";
import { X, Loader2, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const CreateCohortUI = ({
  isOpen,
  onClose,
  onOverlayClick,
  createForm,
  onCreation,
  creationError,
  setCreationError,
  selectedSections,
  onSectionToggle,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    // Prevent double submission
    if (isLoading) {
      return;
    }
    
    setIsLoading(true);
    setCreationError(null);

    try {
      console.log("Form submitted with data:", data);
      const errorMessage = await onCreation(data);
      if (errorMessage) {
        setCreationError(errorMessage);
      } else {
        // Success - close modal and navigate to dashboard
        console.log("Course created successfully, closing modal and navigating...");
        onClose();
        // The onClose function will handle navigation properly
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      setCreationError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex md:items-center md:justify-center items-end justify-center bg-black bg-opacity-50"
      onClick={onOverlayClick}
    >
      <div className="bg-white md:rounded-2xl rounded-b-none shadow-lg w-full max-w-[35rem] lg:mx-4 mx-0 relative h-[100vh] md:h-auto md:max-h-[80vh] flex flex-col">
        {/* Header with close button */}
        <div className="flex items-center justify-between p-5 md:p-5 p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">New Course</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content area with scroll */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5">
            <Form {...createForm}>
              <form
                onSubmit={(e) => {
                  console.log("Form submit event triggered");
                  createForm.handleSubmit(onSubmit)(e);
                }}
                className="space-y-6"
              >
                {/* Name Field */}
                <FormField
                  control={createForm.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel
                        className="block mb-0"
                        style={{
                          fontSize: "15px",
                          fontWeight: "500",
                          color: "black",
                          marginBottom: "4px",
                        }}
                      >
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter course name"
                          className="rounded-lg bg-white focus:ring-0 focus:outline-none transition-colors placeholder:text-slate-700 text-sm"
                          style={{
                            borderColor: "rgb(186, 191, 197)",
                            borderWidth: "1px",
                            paddingTop: "12px",
                            paddingBottom: "12px",
                            paddingLeft: "14px",
                            paddingRight: "14px",
                            height: "44px",
                            color: "black",
                            marginBottom: fieldState?.error ? "4px" : "0px",
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage
                        style={{
                          color: "red",
                          fontSize: "15px",
                          fontWeight: "400",
                          marginTop: "4px",
                        }}
                      />
                    </FormItem>
                  )}
                />

                {/* Start Date Field */}
                <FormField
                  control={createForm.control}
                  name="startDate"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel
                        className="block mb-0"
                        style={{
                          fontSize: "15px",
                          fontWeight: "500",
                          color: "black",
                          marginBottom: "4px",
                        }}
                      >
                        Start Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="rounded-lg bg-white focus:ring-0 focus:outline-none transition-colors text-sm"
                          style={{
                            borderColor: "rgb(186, 191, 197)",
                            borderWidth: "1px",
                            paddingTop: "12px",
                            paddingBottom: "12px",
                            paddingLeft: "14px",
                            paddingRight: "14px",
                            height: "44px",
                            color: "black",
                            marginBottom: fieldState?.error ? "4px" : "0px",
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage
                        style={{
                          color: "red",
                          fontSize: "15px",
                          fontWeight: "400",
                          marginTop: "4px",
                        }}
                      />
                    </FormItem>
                  )}
                />

                {/* End Date Field */}
                <FormField
                  control={createForm.control}
                  name="endDate"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel
                        className="block mb-0"
                        style={{
                          fontSize: "15px",
                          fontWeight: "500",
                          color: "black",
                          marginBottom: "4px",
                        }}
                      >
                        End Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="rounded-lg bg-white focus:ring-0 focus:outline-none transition-colors text-sm"
                          style={{
                            borderColor: "rgb(186, 191, 197)",
                            borderWidth: "1px",
                            paddingTop: "12px",
                            paddingBottom: "12px",
                            paddingLeft: "14px",
                            paddingRight: "14px",
                            height: "44px",
                            color: "black",
                            marginBottom: fieldState?.error ? "4px" : "0px",
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage
                        style={{
                          color: "red",
                          fontSize: "15px",
                          fontWeight: "400",
                          marginTop: "4px",
                        }}
                      />
                    </FormItem>
                  )}
                />

                {/* URL Field */}
                <FormField
                  control={createForm.control}
                  name="url"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel
                        className="block mb-0"
                        style={{
                          fontSize: "15px",
                          fontWeight: "500",
                          color: "black",
                          marginBottom: "4px",
                        }}
                      >
                        Course URL (Give Onedrive / Google Drive , etc)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter any valid URL (optional) - e.g., https://example.com"
                          className="rounded-lg bg-white focus:ring-0 focus:outline-none transition-colors placeholder:text-slate-700 text-sm"
                          style={{
                            borderColor: "rgb(186, 191, 197)",
                            borderWidth: "1px",
                            paddingTop: "12px",
                            paddingBottom: "12px",
                            paddingLeft: "14px",
                            paddingRight: "14px",
                            height: "44px",
                            color: "black",
                            marginBottom: fieldState?.error ? "4px" : "0px",
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage
                        style={{
                          color: "red",
                          fontSize: "15px",
                          fontWeight: "400",
                          marginTop: "4px",
                        }}
                      />
                    </FormItem>
                  )}
                />

                {/* Required Sections (Details, Members) - shown as fixed and required */}
                <div>
                  <FormLabel
                    className="block mb-0"
                    style={{
                      fontSize: "15px",
                      fontWeight: "500",
                      color: "black",
                      marginBottom: "14px",
                    }}
                  >
                    Choose Sections
                  </FormLabel>
                  <div className="space-y-2.5">
                    {[
                      { id: "details", name: "Details", emoji: "📄" },
                      { id: "members", name: "Members", emoji: "👥" },
                    ].map((section) => (
                      <div
                        key={section.id}
                        className={"flex items-center justify-between p-3 rounded-lg border border-[#BABFC5] transition-colors cursor-not-allowed"}
                      >
                        <div className="flex items-center space-x-3">
                          <span
                            className="text-[15px]"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {section.emoji}
                          </span>
                          <span className={"text-[15px] font-medium text-black"}>
                            {section.name}
                          </span>
                        </div>
                        <div>
                          <Check className="w-[18px] h-[18px] text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full text-white font-bold rounded-full transition-all duration-200 mb-0 h-10 md:h-11"
                  style={{
                    backgroundColor: "#1e61f0",
                  }}
                  disabled={isLoading}
                  onClick={() => {
                    console.log("Create Course button clicked, isLoading:", isLoading);
                  }}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLoading ? "Creating..." : "Create Course"}
                </Button>

                {/* Creation Error Message */}
                {creationError && (
                  <div
                    style={{
                      width: "100%",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        color: "red",
                        fontSize: "15px",
                        fontWeight: "400",
                        textAlign: "center",
                      }}
                    >
                      {creationError}
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCohortUI;
