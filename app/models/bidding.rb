class Bidding < ApplicationRecord
  # Validations
  validates :title, presence: true
  validates :status, inclusion: { in: %w[예정 진행중 제출완료 심사중 선정 탈락] }
  validates :progress, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }

  # Scopes
  scope :by_status, ->(status) { where(status: status) if status.present? }
  scope :recent_first, -> { order(created_at: :desc) }
  scope :by_deadline, -> { order(Arel.sql("deadline IS NULL, deadline ASC")) }

  # Status methods
  def self.status_options
    %w[예정 진행중 제출완료 심사중 선정 탈락]
  end

  def self.status_colors
    {
      "예정" => "gray",
      "진행중" => "blue",
      "제출완료" => "yellow",
      "심사중" => "purple",
      "선정" => "green",
      "탈락" => "red"
    }
  end

  def status_color
    self.class.status_colors[status] || "gray"
  end

  def progress_color
    case progress
    when 0...30
      "red"
    when 30...70
      "yellow"
    when 70...90
      "blue"
    else
      "green"
    end
  end
end
